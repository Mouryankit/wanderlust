const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        // console.log("MongoDB Connected");
        console.log("MongoDB Connected to", process.env.MONGO_URL);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;