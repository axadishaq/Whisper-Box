import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnection";
import bcrypt from "bcryptjs";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
   try {
      // Connect to the database
      await dbConnect();

      // Get the session to verify the user
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
         return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
         );
      }

      // Parse the request body
      const body = await request.json();
      const { username, email, password, image } = body; 

      // Find the current user
      const currentUser = await UserModel.findOne({
         email: session.user.email,
      });
      if (!currentUser) {
         return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
         );
      }

      // Check if email is being changed and if it's already taken
      if (email && email !== currentUser.email) {
         const existingUser = await UserModel.findOne({ email });
         if (existingUser) {
            return NextResponse.json(
               { success: false, message: "Email already in use" },
               { status: 400 }
            );
         }
      }

      // Check if username is being changed and if it's already taken
      if (username && username !== currentUser.username) {
         const existingUser = await UserModel.findOne({ username });
         if (existingUser) {
            return NextResponse.json(
               { success: false, message: "Username already taken" },
               { status: 400 }
            );
         }
      }

      // Prepare update data
      const updateData: {
         username?: string;
         email?: string;
         image?: string; 
         password?: string;
      } = {};

      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (image) updateData.image = image; // Changed from avatar to image

      // Hash password only if a new password is provided (not empty string)
      if (password && password.trim() !== "") {
         const hashedPassword = await bcrypt.hash(password, 10);
         updateData.password = hashedPassword;
      }

      // Update the user
      const updatedUser = await UserModel.findByIdAndUpdate(
         currentUser._id,
         updateData,
         { new: true, runValidators: true }
      );

      if (!updatedUser) {
         return NextResponse.json(
            { success: false, message: "Failed to update user" },
            { status: 500 }
         );
      }

      return NextResponse.json(
         {
            success: true,
            message: "User updated successfully",
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
         { success: false, message: "Internal server error" },
         { status: 500 }
      );
   }
}
