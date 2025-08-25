import * as React from "react";
import {
   Body,
   Container,
   Head,
   Heading,
   Html,
   Section,
   Text,
} from "@react-email/components";

interface VerificationEmailProps {
   username: string;
   otp: string;
}

export default function EmailTemplate({
   username,
   otp,
}: Readonly<VerificationEmailProps>) {
   return (
      <>
         <Html lang="en" dir="ltr">
            <Head>
               <title>Whisper Box Verification Code</title>
            </Head>

            <Body
               style={{
                  backgroundColor: "#ffffff",
                  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
               }}>
               <Container
                  style={{
                     backgroundColor: "#ffffff",
                     border: "1px solid #eee",
                     borderRadius: "5px",
                     boxShadow: "0 5px 10px rgba(20,50,70,.2)",
                     marginTop: "20px",
                     maxWidth: "360px",
                     margin: "0 auto",
                     padding: "68px 0 130px",
                  }}>
                  <Heading
                     style={{
                        color: "#000",
                        display: "inline-block",
                        fontFamily:
                           "HelveticaNeue-Medium,Helvetica,Arial,sans-serif",
                        fontSize: "20px",
                        fontWeight: 500,
                        lineHeight: "24px",
                        marginBottom: "0",
                        marginTop: "0",
                        textAlign: "center",
                     }}>
                     Hello {username},
                  </Heading>
                  <Section
                     style={{
                        background: "rgba(0,0,0,.05)",
                        borderRadius: "4px",
                        margin: "16px auto 14px",
                        verticalAlign: "middle",
                        width: "280px",
                     }}>
                     <Text
                        style={{
                           color: "#000",
                           fontFamily: "HelveticaNeue-Bold",
                           fontSize: "32px",
                           fontWeight: 700,
                           letterSpacing: "6px",
                           lineHeight: "40px",
                           paddingBottom: "8px",
                           paddingTop: "8px",
                           margin: "0 auto",
                           display: "block",
                           textAlign: "center",
                        }}>
                        {otp}
                     </Text>
                  </Section>
                  <Text
                     style={{
                        color: "#444",
                        fontSize: "15px",
                        fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
                        letterSpacing: "0",
                        lineHeight: "23px",
                        padding: "0 40px",
                        margin: "0",
                        textAlign: "center",
                     }}>
                     Thank you for registration your email. Enter the following
                     code to complete registration:
                  </Text>
               </Container>
            </Body>
         </Html>
      </>
   );
}
