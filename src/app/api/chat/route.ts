import { google } from "@ai-sdk/google";
import fs from "fs";

import {
   streamText,
   UIMessage,
   convertToModelMessages,
   APICallError,
} from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
   const { messages }: { messages: UIMessage[] } = await req.json();
   const instruction = fs.readFileSync("whisper_box_user_guide.txt", "utf8");

   try {
      const result = streamText({
         model: google("gemini-2.5-flash"),
         system: instruction,
         prompt: convertToModelMessages(messages),
      });

      return result.toUIMessageStreamResponse();
   } catch (error) {
      if (APICallError.isInstance(error)) {
         const { statusCode, responseHeaders, responseBody } = error;
         return NextResponse.json(
            {
               message: "An error occurred with the API call.",
               details: {
                  statusCode,
                  responseHeaders,
                  responseBody,
               },
            },
            { status: statusCode }
         );
      } else {
         console.error("Unexpected Error Occurred", error);
         const errorMessage =
            error instanceof Error
               ? error.message
               : "An unknown error occurred";
         return NextResponse.json(
            {
               message: "An unexpected error occurred.",
               error: errorMessage,
            },
            { status: 500 }
         );
      }
   }
}
