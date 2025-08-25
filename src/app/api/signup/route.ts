import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helper/SendVerificationEmail";

export async function POST(request: NextRequest) {
   await dbConnect();
   try {
      const reqBody = await request.json();
      const { username, email, password } = reqBody;
      //validation
      console.log(reqBody);

      const existingUserVerifiedByUsername = await UserModel.findOne({
         username,
         isVerified: true,
      });
      if (existingUserVerifiedByUsername) {
         return NextResponse.json(
            { success: false, message: "Username already taken!" },
            { status: 400 }
         );
      }
      //checking user by email
      const existingUserByEmail = await UserModel.findOne({
         email,
      });
      //OTP generation
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      if (existingUserByEmail) {
         if (existingUserByEmail.isVerified) {
            return NextResponse.json(
               {
                  success: false,
                  message: "User already Exists with this mail!",
               },
               { status: 400 }
            );
         } else {
            const hashedPassword = await bcryptjs.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(
               Date.now() + 3600000
            );
            await existingUserByEmail.save();
         }
      } else {
         //bcrypt password
         const hashedPassword = await bcryptjs.hash(password, 10);
         const expiryDate = new Date();
         expiryDate.setHours(expiryDate.getHours() + 1);
         // Default welcome messages for new users
         const defaultMessages = [
            {
               content:
                  "Welcome to Whisper Box! We're excited to have you here. 😊",
               createdAt: new Date(),
            },
            {
               content:
                  "Thanks for joining us! Feel free to explore and connect with others.",
               createdAt: new Date(),
            },
            {
               content:
                  "You can Switch the button if you not want to recieve messages!.",
               createdAt: new Date(),
            },
         ];

         //saving user
         const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            message: defaultMessages,
         });
         await newUser.save();
         // console.log(savedUser);
      }

      //send verification email
      const emailResponse = await sendVerificationEmail(
         email,
         username,
         verifyCode
      );
      if (!emailResponse.success) {
         return Response.json(
            {
               success: false,
               message: emailResponse.message,
            },
            { status: 500 }
         );
      }
      return Response.json(
         {
            success: true,
            message: "User register successfully. Please verify your mail",
         },
         { status: 201 }
      );
   } catch (error: unknown) {
      console.log("Error registering", error);
      const errorMessage =
         error instanceof Error ? error.message : "Unknown error occurred";
      return NextResponse.json(
         { success: false, message: errorMessage },
         { status: 500 }
      );
   }
}
