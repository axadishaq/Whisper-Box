import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user.model";
import { Message } from "@/models/user.model";

export async function POST(request: Request) {
   await dbConnect();
   const { username, content } = await request.json();
   try {
      const user = await UserModel.findOne({ username });
      if (!user) {
         return Response.json(
            {
               success: false,
               message: "User not found",
            },
            { status: 404 }
         );
      }
      if (!user.isAcceptingMessages) {
         return Response.json(
            {
               success: false,
               message: "User not accepting message",
            },
            { status: 403 }
         );
      }
      const newMessage = { content, createdAt: new Date() };
      user.message.push(newMessage as Message);
      await user.save();

      return Response.json(
         {
            success: true,
            message: "Message send Successfully",
         },
         { status: 200 }
      );
   } catch (error) {
      console.log("Error sending message", error);
      return Response.json(
         {
            success: false,
            message: "Internal server error",
         },
         { status: 500 }
      );
   }
}
