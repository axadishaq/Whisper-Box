import { Resend } from "resend";
// import EmailTemplate from "../../emails/VerificationEmailTemplete";
import { ApiResponse } from "@/types/ApiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);
// const html = render();
export async function sendVerificationEmail(
   email: string,
   username: string,
   verifyCode: string
): Promise<ApiResponse> {
   // NOTE: The 'from' address for Resend in development must be 'onboarding@resend.dev'
   try {
      const { data, error } = await resend.emails.send({
         from: "Whisper Box <onboarding@resend.dev>",
         to: "axadishaq.official@gmail.com",
         subject: "Whisper Box Verification code",
         html: `<html lang="en">
            <head>
               <meta charSet="UTF-8" />
               <title>Whisper Box Verification Code</title>
            </head>
            <body
               style={{
                  fontFamily: "Arial, sans-serif",
                  backgroundColor: "#f9f9f9",
                  padding: "20px",
               }}>
               <div
                  style={{
                     maxWidth: "480px",
                     margin: "0 auto",
                     backgroundColor: "#fff",
                     border: "1px solid #eaeaea",
                     borderRadius: "8px",
                     padding: "24px",
                  }}>
                  <h2 style={{ color: "#333", textAlign: "center" }}>
                     Hello ${username},
                  </h2>
                  <p
                     style={{
                        color: "#555",
                        fontSize: "16px",
                        lineHeight: "24px",
                        textAlign: "center",
                     }}>
                     Thanks for signing up! Use the code below to verify your
                     email:
                  </p>
                  <div
                     style={{
                        background: "#f3f3f3",
                        borderRadius: "6px",
                        padding: "12px 0",
                        textAlign: "center",
                        margin: "24px 0",
                     }}>
                     <span
                        style={{
                           fontSize: "32px",
                           fontWeight: "bold",
                           letterSpacing: "4px",
                           color: "#111",
                        }}>
                        ${verifyCode}
                     </span>
                  </div>
                  <p
                     style={{
                        color: "#555",
                        fontSize: "14px",
                        textAlign: "center",
                     }}>
                     Thank you for registration your email. Enter the following
                     code to complete registration, this code will expire in 10
                     minutes.
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
         console.error("Error sending email:", error, data);
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
      console.error("Error sending verification email:", emailError);
      return { success: false, message: "Failed to send verification email." };
   }
}
