import "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
   interface User {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
      image?: string; 
   }
   interface Session {
      user: {
         _id?: string;
         isVerified?: boolean;
         isAcceptingMessages?: boolean;
         username?: string;
         image?: string; 
      } & DefaultSession["user"];
   }
   interface Profile {
      picture?: string;
   }
}
//or
declare module "next-auth/jwt" {
   interface JWT {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
      image?: string;
   }
}
