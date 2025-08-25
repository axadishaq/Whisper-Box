import z from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user.model";

const UsernameQuerySchema = z.object({
   username: usernameValidation,
});

export async function GET(request: Request) {
   await dbConnect();

   try {
      const { searchParams } = new URL(request.url);
      const queryParam = { username: searchParams.get("username") };

      //validate with zod
      const result = UsernameQuerySchema.safeParse(queryParam);

      //   console.log(result)
      if (!result.success) {
         const usernameError = result.error.format().username?._errors || [];
         return Response.json(
            {
               success: false,
               message:
                  usernameError?.length > 0
                     ? usernameError.join(", ")
                     : "Invalid query parameters",
            },
            { status: 400 }
         );
      }

      const { username } = result.data;
      //check db
      const existingVerifiedUser = await UserModel.findOne({
         username,
         isVerified: true,
      });
      if (existingVerifiedUser) {
         return Response.json(
            {
               success: false,
               message: "Username already taken",
            },
            { status: 400 }
         );
      }
      return Response.json(
         {
            success: true,
            message: "Username is unique.",
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error Checking Username", error);
      return Response.json(
         {
            success: false,
            message: "Error Checking Username",
         },
         { status: 500 }
      );
   }
}
