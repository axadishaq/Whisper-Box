import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";

export async function GET(request: Request) {
   await dbConnect();
   const session = await getServerSession(authOptions);
   const user: User = session?.user as User;
   if (!session || !session.user) {
      return Response.json(
         {
            success: false,
            message: "Not authenticated",
         },
         { status: 401 }
      );
   }

   const userId = new mongoose.Types.ObjectId(user._id);

   try {
      const userAgg = await UserModel.aggregate([
         { $match: { _id: userId } },
         { $unwind: { path: "$message", preserveNullAndEmptyArrays: true } },
         { $sort: { "message.createdAt": -1 } },
         { $group: { _id: "$_id", messages: { $push: "$message" } } },
         {
            $project: {
               messages: {
                  $filter: {
                     input: "$messages",
                     as: "m",
                     cond: { $ne: ["$$m", null] },
                  },
               },
            },
         },
      ]);

      if (!userAgg || userAgg.length === 0) {
         return Response.json(
            { success: false, message: "User not found" },
            { status: 404 }
         );
      }

      return Response.json(
         { success: true, messages: userAgg[0].messages },
         { status: 200 }
      );
   } catch (error) {
      console.log(error);
      return Response.json(
         {
            success: false,
            message: "Error occured",
         },
         { status: 500 }
      );
   }
}
