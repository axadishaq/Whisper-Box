import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import ChatWidget from "@/components/ChatWidget";
import AuthProvider from "@/context/AuthProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Whisper Box",
   description: "Developed by ASAD",
};

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const cookieStore = await cookies();
   const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
   return (
      <html lang="en" suppressHydrationWarning>
         <AuthProvider>
            <body
               className={`${geistSans.variable} ${geistMono.variable} antialiased flex overflow-x-hidden`}>
               <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange>
                  <SidebarProvider defaultOpen={defaultOpen}>
                     <AppSidebar />
                     <main className="w-full overflow-x-hidden">
                        <Navbar />
                        <div className="px-4">{children}</div>
                        <Toaster position="top-center" />
                        <ChatWidget />
                     </main>
                  </SidebarProvider>
               </ThemeProvider>
               <Analytics mode="production" />
            </body>
         </AuthProvider>
      </html>
   );
}
