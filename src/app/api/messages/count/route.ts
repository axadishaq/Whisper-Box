import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";

export async function GET(request: Request) {
   try {
      await dbConnect();
      const session = await getServerSession(authOptions);
      const user: User = session?.user as User;

      // Debug: Check if database has any users
      // const totalUsers = await UserModel.countDocuments();
      // console.log("Total users in database:", totalUsers);

      if (!session || !session.user) {
         return Response.json(
            {
               success: false,
               message: "Not authenticated",
            },
            { status: 401 }
         );
      }

      // console.log("Session user:", session.user);
      // console.log("User ID:", session.user._id);

      const userId = new mongoose.Types.ObjectId(session.user._id);
      // console.log("MongoDB ObjectId:", userId);

      // Use findOne with projection for better performance
      const userData = await UserModel.findOne({ _id: userId }).select(
         "message"
      );

      // console.log("User data found:", !!userData);
      // console.log("User data:", userData);

      if (!userData) {
         return Response.json(
            { success: false, message: "User not found" },
            { status: 404 }
         );
      }

      const totalMessages = userData.message ? userData.message.length : 0;

      // Get recent messages (last 3 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentMessages = userData.message.filter(
         (msg) =>
            msg && msg.createdAt && new Date(msg.createdAt) >= sevenDaysAgo
      ).length;

      return Response.json(
         {
            success: true,
            totalMessages,
            recentMessages,
            total: totalMessages,
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error in count API:", error);
      return Response.json(
         {
            success: false,
            message: "Error occurred while fetching message count",
         },
         { status: 500 }
      );
   }
}
