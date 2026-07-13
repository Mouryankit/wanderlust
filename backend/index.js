const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRouter");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const bookingRoutes = require("./routes/booking");
const profileRoutes = require("./routes/profileRouter");
const errorHandler = require("./middleware/errorHandler");
const cron = require("node-cron");
const runGuestCleanup = require("./utils/cleanup");

const app = express();

const dns = require('dns');

if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

// connect database
connectDB();

// middleware

// app.use(cors()); // for localhost 
app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"].filter(Boolean),
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    app: "Wanderlust API",
    status: "Running"
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/listings/:id/reviews", reviewRoutes);
app.use("/api/listings/:id/bookings", bookingRoutes);
app.use("/api/profile", profileRoutes);

// error handling middleware (should be last middleware)
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send("Route not found");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
  
  // Schedule guest cleanup job to run every hour
  cron.schedule("0 * * * *", () => {
    runGuestCleanup();
  });

  // Run cleanup once on startup to clean up leftover users from previous runs
  runGuestCleanup();
});