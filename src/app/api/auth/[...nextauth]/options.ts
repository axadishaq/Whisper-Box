import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

interface Credentials {
   identifier: string;
   password: string;
}

export const authOptions: NextAuthOptions = {
   providers: [
      CredentialsProvider({
         id: "credentials",
         name: "credentials",
         credentials: {
            identifier: { label: "Email or Username", type: "text" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials: Credentials | undefined) {
            // Add logic here to look up the user from the credentials supplied
            await dbConnect();
            try {
               if (!credentials) {
                  throw new Error("Credentials are required");
               }
               const user = await UserModel.findOne({
                  $or: [
                     { email: new RegExp(`^${credentials.identifier}$`, "i") },
                     {
                        username: new RegExp(
                           `^${credentials.identifier}$`,
                           "i"
                        ),
                     },
                  ],
               }).lean();
               if (!user) {
                  throw new Error("No user found with this mail or username");
               }
               if (!user.isVerified) {
                  throw new Error("Please verify your account first");
               }
               const isCorrectPassword = await bcrypt.compare(
                  credentials.password!,
                  user.password!
               );
               if (isCorrectPassword) {
                  // Convert MongoDB document to plain object for NextAuth
                  return {
                     id: user._id.toString(),
                     email: user.email,
                     username: user.username,
                     isVerified: user.isVerified,
                     isAcceptingMessages: user.isAcceptingMessages,
                     image: user.image,
                  };
               } else {
                  throw new Error("Incorrect Password!");
               }
            } catch (error: unknown) {
               if (error instanceof Error) {
                  throw new Error(error.message);
               }
               throw new Error("An unknown error occurred");
            }
         },
      }),

      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
   ],
   callbacks: {
      async signIn({ account, profile }) {
         // console.log("Google SignIn Profile:", profile); // Log the profile for debugging
         if (account?.provider === "google") {
            // Check if user exists
            await dbConnect();
            const existingUser = await UserModel.findOne({
               email: profile?.email,
            });

            if (!existingUser) {
               // Generate unique username from email
               const baseUsername = profile?.email?.split("@")[0] || "user";
               let username = baseUsername;
               let counter = 1;

               // Keep trying until we find a unique username
               while (await UserModel.findOne({ username })) {
                  username = `${baseUsername}${counter}`;
                  counter++;
               }

               // Create new user with Google profile picture and default messages
               await UserModel.create({
                  email: profile?.email,
                  username: username,
                  image: profile?.picture || "", // Get profile picture from Google
                  isVerified: true, // Google users are pre-verified
                  isAcceptingMessages: true,
                  // Note: No password for Google users
                  messages: [
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
                  ],
               });
            }
         }
         return true;
      },
      async jwt({ token, user, account }) {
         // console.log("JWT Callback - Initial token:", token);
         // console.log("JWT Callback - User object:", user);
         // console.log("JWT Callback - Account:", account);

         // If user is logging in for the first time, populate token with user data
         if (user) {
            // console.log("JWT Callback - User:", user); // Log user data for debugging
            if (account?.provider === "google") {
               await dbConnect();
               const dbUser = await UserModel.findOne({ email: user.email });
               if (dbUser) {
                  token._id = dbUser._id?.toString() || "";
                  token.username = dbUser.username || "";
                  token.isVerified = dbUser.isVerified || false;
                  token.isAcceptingMessages =
                     dbUser.isAcceptingMessages || true;
                  token.image = dbUser.image || "";
               } else {
                  // console.log("No user found in database for email:", user.email);
               }
            } else {
               // Existing credentials logic
               token._id = user.id?.toString();
               token.isVerified = user.isVerified;
               token.isAcceptingMessages = user.isAcceptingMessages;
               token.username = user.username;
               token.image = user.image;
            }
         } else {
            // If token already exists (session refresh), fetch latest user data from database
            try {
               await dbConnect();
               const currentUser = await UserModel.findById(token._id);
               if (currentUser) {
                  token._id = currentUser._id?.toString();
                  token.isVerified = currentUser.isVerified;
                  token.isAcceptingMessages = currentUser.isAcceptingMessages;
                  token.username = currentUser.username;
                  token.image = currentUser.image;
               }
            } catch (error) {
               console.error("Error fetching user data for JWT:", error);
            }
         }
         // console.log("token",token);
         return token;
      },
      async session({ session, token }) {
         // console.log("Session Callback Token:", token); // Log token for debugging
         if (token) {
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
            session.user.username = token.username;
            session.user.image = token.image || token.picture || "";
         }
         // console.log("Session Callback Session:", session); // Log session for debugging
         return session;
      },
   },
   pages: {
      //can change pages route
      signIn: "/auth/signin",
   },
   session: {
      strategy: "jwt",
   },
   secret: process.env.TOKEN_SECRET,
};
