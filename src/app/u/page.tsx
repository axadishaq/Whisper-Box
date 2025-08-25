"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function UserProfileLanding() {
   const [username, setUsername] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (username.trim()) {
         setIsLoading(true);
         // Simulate loading for better UX
         setTimeout(() => {
            router.push(`/u/${username.trim()}`);
            setIsLoading(false);
         }, 500);
      }
   };

   return (
      <div className="min-h-[80vh]">
         {/* Main Content */}
         <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-16">
               <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-800  bg-clip-text text-transparent mb-4">
                  Whisper Box
               </h1>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Discover anonymous messages and connect with others through
                  honest, heartfelt conversations
               </p>
            </div>

            {/* Username Input Form */}
            <div className="flex justify-center">
               <Card className="w-full max-w-md">
                  <CardHeader>
                     <CardTitle className="text-center">
                        Enter Username
                     </CardTitle>
                     <CardDescription className="text-center">
                        Enter a username to Send Message or feedback
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                           <Input
                              placeholder="Enter username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="text-center"
                           />
                        </div>
                        <Button
                           type="submit"
                           className="w-full"
                           disabled={isLoading || !username.trim()}>
                           {isLoading ? (
                              <div className="flex items-center">
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                 Redirecting...
                              </div>
                           ) : (
                              "Send Message"
                           )}
                        </Button>
                     </form>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
