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

      if (!session || !session.user) {
         // console.log("Session check failed:", {
         //    hasSession: !!session,
         //    hasUser: !!session?.user,
         //    hasUserId: !!session?.user?._id,
         // });
         return Response.json(
            {
               success: false,
               message: "Not authenticated",
            },
            { status: 401 }
         );
      }

      const userId = new mongoose.Types.ObjectId(user._id);
      // console.log(userId);

      // Use findOne with projection for better performance
      const userData = await UserModel.findOne({ _id: userId }).select(
         "message"
      );

      if (!userData || !userData.message || userData.message.length === 0) {
         return Response.json(
            {
               success: true,
               monthlyStats: [],
               weeklyStats: [],
            },
            { status: 200 }
         );
      }

      // Process messages in memory for better performance
      const messages = userData.message.filter((msg) => msg && msg.createdAt);

      // Group by month
      const monthlyMap = new Map<string, number>();

      messages.forEach((msg) => {
         const date = new Date(msg.createdAt);
         const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
         monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
      });

      // Convert maps to arrays and sort
      const monthlyStats = Array.from(monthlyMap.entries())
         .map(([month, messages]) => ({ month, messages }))
         .sort((a, b) => a.month.localeCompare(b.month));

      return Response.json(
         {
            success: true,
            monthlyStats: monthlyStats.slice(-6), // Last 6 months
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error in stats API:", error);
      return Response.json(
         {
            success: false,
            message: "Error occurred while fetching stats",
         },
         { status: 500 }
      );
   }
}
