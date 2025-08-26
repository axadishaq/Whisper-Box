import { Resend } from "resend";
// import EmailTemplate from "../../emails/VerificationEmailTemplete";
import { ApiResponse } from "@/types/ApiResponse";

// const html = render();
export async function sendVerificationEmail(
   email: string,
   username: string,
   verifyCode: string
): Promise<ApiResponse> {
   // NOTE: The 'from' address for Resend in development must be 'onboarding@resend.dev'
   const resend = new Resend(process.env.RESEND_API_KEY);
   try {
      const { data, error } = await resend.emails.send({
         from: "Whisper Box <onboarding@resend.dev>",
         to: "axadishaq.official@gmail.com",
         // to: email,
         subject: "Whisper Box Verification code",
         html: `<html lang="en">
            <head>
               <meta charSet="UTF-8" />
               <title>Whisper Box Verification Code</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
               <div style="max-width: 480px; margin: 0 auto; background-color: #fff; border: 1px solid #eaeaea; border-radius: 8px; padding: 24px;">
                  <h2 style="color: #333; text-align: center;">
                     Hello ${username},
                  </h2>
                  <p style="color: #555; font-size: 16px; line-height: 24px; text-align: center;">
                     Thanks for signing up! Use the code below to verify your email:
                  </p>
                  <div style="background: #f3f3f3; border-radius: 6px; padding: 12px 0; text-align: center; margin: 24px 0;">
                     <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111;">
                        ${verifyCode}
                     </span>
                  </div>
                  <p style="color: #555; font-size: 14px; text-align: center;">
                     Or click the link below to verify your email automatically:
                  </p>
                  <div style="text-align: center; margin: 20px 0;">
                     <a href="${process.env.DOMAIN}/verify/${username}?code=${verifyCode}" 
                        style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        Verify My Email
                     </a>
                  </div>
                  <p style="color: #555; font-size: 14px; text-align: center;">
                     This verification code will expire in 1 hour. If you didn't request this, please ignore this email.
                  </p>
               </div>
            </body>
         </html>`,
         // react: EmailTemplate({
         //    username,
         //    otp: verifyCode,
         // }) as React.ReactElement,
      });

      if (error) {
         // console.error("Error sending email:", error, data);
         return {
            success: false,
            message: "Failed to send verification email.",
         };
      }
      console.log(data);
      return {
         success: true,
         message: "Verification email sent successfully.",
      };
   } catch (emailError) {
      // console.error("Error sending verification email:", emailError);
      return {
         success: false,
         message:
            emailError instanceof Error
               ? emailError.message
               : "Failed to send verification email.",
      };
   }
}
