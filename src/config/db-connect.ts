import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("DB Already Connected");
    return;
  }
  try {
    const db = await mongoose.connect(MONGO_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default dbConnect;
