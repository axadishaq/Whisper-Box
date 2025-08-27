import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user.model";

export async function POST(request: Request) {
   await dbConnect();
   try {
      const { username, code } = await request.json();
      const decodeUsername = decodeURIComponent(username);
      const normalizedUsername = decodeUsername.toLowerCase();
      const user = await UserModel.findOne({
         username: normalizedUsername,
      });
      if (!user) {
         return Response.json(
            {
               success: false,
               message: "User not found",
            },
            { status: 500 }
         );
      }
      //code validation
      const isCodeValid = user.verifyCode === code;
      const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();
      if (isCodeValid && isCodeExpired) {
         user.isVerified = true;
         await user.save();
         
         return Response.json(
            {
               success: true,
               message: "Account verified successfully",
            },
            { status: 200 }
         );
      } else if (!isCodeExpired) {
         return Response.json(
            {
               success: false,
               message:
                  "Verification code has expired, please signup again to continue",
            },
            { status: 400 }
         );
      } else {
         return Response.json(
            {
               success: false,
               message: "Incorrect verification code",
            },
            { status: 400 }
         );
      }
   } catch (error) {
      console.error("Error verifying User", error);
      return Response.json(
         {
            success: false,
            message: "Error verify User",
         },
         { status: 500 }
      );
   }
}
