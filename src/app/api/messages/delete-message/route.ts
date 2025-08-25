import dbConnect from "@/lib/dbConnection";
import { getServerSession, type User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";

export async function DELETE(request: Request) {
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

   // Get messageId from URL search params
   const url = new URL(request.url);
   const messageId = url.searchParams.get("messageId");

   if (!messageId) {
      return Response.json(
         {
            success: false,
            message: "Message ID is required",
         },
         { status: 400 }
      );
   }

   try {
      const updateResult = await UserModel.updateOne(
         { _id: new mongoose.Types.ObjectId(user._id) },
         { $pull: { message: { _id: new mongoose.Types.ObjectId(messageId) } } }
      );

      if (updateResult.modifiedCount === 0) {
         return Response.json(
            {
               success: false,
               message: "Message not found or already deleted",
            },
            { status: 404 }
         );
      }

      return Response.json(
         {
            success: true,
            message: "Message deleted successfully",
         },
         { status: 200 }
      );
   } catch (error) {
      console.log("Error deleting message", error);
      return Response.json(
         {
            success: false,
            message: "Error deleting message",
         },
         { status: 500 }
      );
   }
}
