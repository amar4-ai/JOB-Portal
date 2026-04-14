import mongoose from "mongoose";

// Function to connect mongoose db 
const connectDB = async()=>{
    mongoose.connection.on('connected',()=> console.log('Database connected'))
    mongoose.connect(`${process.env.MONGO_URI}/job-portal`)
}

export default connectDB;