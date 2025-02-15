import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongoDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING
    );
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    throw new Error(error);
  }
};

export default connectMongoDB;
