import mongoose from "mongoose";

export const connectDB = async (url: string): Promise<void> => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};
