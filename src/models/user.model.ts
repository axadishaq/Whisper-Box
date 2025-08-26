import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
   content: string;
   createdAt: Date;
}
const MessageScheme: Schema<Message> = new Schema({
   content: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
      required: true,
      default: Date.now,
   },
});
//user Schema
export interface User extends Document {
   username: string;
   email: string;
   password?: string;
   image?: string; // Changed from avatar to image
   verifyCode: string;
   verifyCodeExpiry: Date;
   isAcceptingMessages: boolean;
   isVerified: boolean;
   isAdmin: boolean;
   message: Message[];
}
const UserSchema: Schema<User> = new Schema({
   username: {
      type: String,
      required: [true, "please provide a username"],
      unique: true,
   },
   email: {
      type: String,
      required: [true, "please provide a email"],
      unique: true,
   },
   password: {
      type: String,
      required: false,
   },
   image: {
      type: String,
      required: false,
   }, 

   isVerified: {
      type: Boolean,
      default: false,
   },

   isAdmin: {
      type: Boolean,
      default: false,
   },
   isAcceptingMessages: {
      type: Boolean,
      default: true,
   },
   message: [MessageScheme],
   // forgotPasswordToken: String,
   // forgotPasswordTokenExpiry: Date,
   verifyCode: String,
   verifyCodeExpiry: Date,
});

const UserModel =
   (mongoose.models.User as mongoose.Model<User>) ||
   mongoose.model<User>("User", UserSchema);

export default UserModel;
