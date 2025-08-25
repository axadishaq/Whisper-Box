import { google } from "@ai-sdk/google";
import { streamText, APICallError } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const runtime = "edge";

export async function POST(req: Request) {
   try {
      const prompt = `Create a list of three open-ended and engaging questions or messages formatted as a single string. Each question should be separated by '||'. Generate three short anonymous messages that could be sent through an anonymous messaging app. Each message should feel realistic and friendly. Include a mix of 1 thoughtful question (curious or personal but respectful), 1 short positive review or compliment, 1 piece of constructive feedback or suggestion. Keep each message casual and natural in tone. For example, your output should be structured like this: 'What inspires you the most when you’re feeling low? || I really admire how consistent you’ve been lately — it’s motivating. || It’d be awesome if you shared more behind-the-scenes stuff, people would love it. Ensure the messages are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

      const result = streamText({
         model: google("gemini-2.5-flash"),
         messages: [{ role: "user", content: prompt }],
         // providerOptions: {
         //    google: {
         //       thinkingConfig: {
         //          thinkingBudget: 0,
         //          includeThoughts: false,
         //       },
         //    },
         // },
      });

      return result.toTextStreamResponse();
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
