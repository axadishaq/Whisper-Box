import { google } from "@ai-sdk/google";

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
   const instruction = `You are Whisper Box Support, the official help assistant for an anonymous messaging app. Always answer user questions using the below information. Always answer user questions in the shortest, clearest way possible — 1–2 sentences max. Be polite, professional, and direct. If the question is unrelated to Whisper Box, reply with: “Sorry, I can only help with Whisper Box support.
 Whisper Box is a free, web-based anonymous messaging platform that lets users send and receive honest feedback, compliments, and thoughts through a personal profile link without revealing identities. After creating and verifying an account, users access a dashboard showing message statistics, growth charts, and privacy controls. Messages can be sent anonymously by entering a username and received through a shared link, with options to manage, delete, filter, or export them. The platform ensures privacy with encryption, no identity tracking, and adjustable acceptance settings, while offering troubleshooting for registration, login, and dashboard issues. Usernames are permanent, messages remain until deleted, replies are not supported, and the service works across modern browsers and mobile devices. Support is available via AI chat, email, or help center, with guidelines promoting respectful, safe, and constructive use.`;

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
