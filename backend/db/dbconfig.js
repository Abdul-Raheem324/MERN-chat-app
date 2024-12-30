import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};
export default connectMongoDB;
