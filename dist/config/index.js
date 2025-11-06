import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
export const config = {
    port: process.env.PORT || 8081,
    jwtSecret: process.env.JWT_SECRET || "dev_secret",
    mongoUri: process.env.MONGO_URI || "mongodb+srv://kegzpeach:hlHe8HN2m8TgOB1F@tangomanagement.ngouqxc.mongodb.net/tcms_user"
};
export const connectDb = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log("✅ MongoDB connected");
    }
    catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    }
};
