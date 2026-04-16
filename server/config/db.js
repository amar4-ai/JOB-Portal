
import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("⚡ Using existing DB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "job-portal", 
    });

    isConnected = conn.connections[0].readyState === 1;

    console.log("MongoDB Connected");
  } catch (error) {
    console.error(" DB Connection Error:", error);
  }
};

export default connectDB;