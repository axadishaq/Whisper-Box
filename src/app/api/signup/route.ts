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
      // console.log("Signup attempt:", { username, email });

      const existingUserVerifiedByUsername = await UserModel.findOne({
         username,
         isVerified: true,
      });
      if (existingUserVerifiedByUsername) {
         // console.log("Username already taken:", username);
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
      // console.log("Generated verification code for:", email);

      if (existingUserByEmail) {
         if (existingUserByEmail.isVerified) {
            // console.log("User already exists with verified email:", email);
            return NextResponse.json(
               {
                  success: false,
                  message: "User already Exists with this mail!",
               },
               { status: 400 }
            );
         } else {
            // console.log("Updating existing unverified user:", email);
            const hashedPassword = await bcryptjs.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(
               Date.now() + 3600000
            );
            await existingUserByEmail.save();
            console.log("User updated successfully:", email);
         }
      } else {
         // console.log("Creating new user:", email);
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
         // console.log("New user created successfully:", email);
      }

      //send verification email
      // console.log("Sending verification email to:", email);
      const emailResponse = await sendVerificationEmail(
         email,
         username,
         verifyCode
      );
      if (!emailResponse.success) {
         console.error("Failed to send verification email:", emailResponse.message);
         return Response.json(
            {
               success: false,
               message: emailResponse.message,
            },
            { status: 500 }
         );
      }
      // console.log("Verification email sent successfully to:", email);
      return Response.json(
         {
            success: true,
            message: "User register successfully. Please verify your mail",
         },
         { status: 201 }
      );
   } catch (error: unknown) {
      console.error("Error registering user:", error);
      const errorMessage =
         error instanceof Error ? error.message : "Unknown error occurred";
      return NextResponse.json(
         { success: false, message: errorMessage },
         { status: 500 }
      );
   }
}
