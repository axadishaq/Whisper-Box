import mongoose from "mongoose";

type ConnectionObject = {
   isConnected?: number;
};
const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
   if (connection.isConnected) {
      console.log("Already Connected.");
      return;
   }
   try {
      const db = await mongoose.connect(process.env.MONGO_DB || "", {});
      connection.isConnected = db.connections[0].readyState;
      // console.log(db.Connection)
      //   console.log(db);
      console.log("DB Connected Successfully.");
   } catch (error) {
      console.log("Database connection failed!", error);
      process.exit(1);
   }
}
