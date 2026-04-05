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

const app = express();

// connect database
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/listings/:id/reviews", reviewRoutes);
app.use("/api/listings/:id/bookings", bookingRoutes);
app.use("/api/profile", profileRoutes);

// error handling middleware (should be last middleware)
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Wanderlust API Running ");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});