const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables 
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("DB Connected");
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process if DB connection fails
    }
};

module.exports = connectDB; 
