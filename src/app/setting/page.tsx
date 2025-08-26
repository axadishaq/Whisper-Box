"use client";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import EditUser from "@/components/EditUser";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import {
   User2,
   Verified,
   MailCheck,
   CircleCheckBig,
   MessageSquareWarning,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { fadeInUp, slideInLeft, staggerContainer } from "@/lib/animations";

const Setting = () => {
   const [loading, setLoading] = useState(true);
   const { data: session, status, update } = useSession();
   const user = session?.user as User;
   const [refreshKey, setRefreshKey] = useState(0);

   // Define the type for stats
   type StatItem = {
      title: string;
      value: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      color: string;
      bgColor: string;
   };
   const [stats, setStats] = useState<StatItem[]>([]);

   useEffect(() => {
      if (user) {
         setStats([
            {
               title: "Username",
               value: user.username || "Not Set ",
               icon: User2,
               color: "text-blue-500",
               bgColor: "bg-blue-50 dark:bg-blue-900/20",
            },
            {
               title: "Verified",
               value: "Verification Completed",
               icon: Verified,
               color: "text-green-500",
               bgColor: "bg-green-50 dark:bg-green-900/20",
            },
            {
               title: "Email",
               value: user.email || "Error fetching",
               icon: MailCheck,
               color: "text-pink-500",
               bgColor: "bg-pink-50 dark:bg-pink-900/20",
            },
            {
               title: "Accepting Messages",
               value: user.isAcceptingMessages ? "Yes" : "No",
               icon: CircleCheckBig,
               color: "text-orange-500",
               bgColor: "bg-orange-900/20",
            },
         ]);
      }
   }, [user]);

   useEffect(() => {
      if (status !== "loading") {
         setLoading(false);
      }
   }, [status, refreshKey]);

   if (loading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen py-8">
            <Loading />
         </div>
      );
   }

   if (!user) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen py-8">
            <div className="w-full max-w-md bg-primary-foreground rounded-lg shadow p-6 flex flex-col items-center">
               <p className="text-center">
                  Please sign in to view your profile.
               </p>
            </div>
         </div>
      );
   }

   return (
      <motion.div 
         className="min-h-[80vh] py-6 px-4 flex flex-col gap-6"
         initial="hidden"
         animate="visible"
         variants={staggerContainer}
      >
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div variants={slideInLeft} className="bg-primary-foreground p-3 rounded-xl ">
               <Avatar className="w-full h-full ">
                  <AvatarImage
                     className="object-cover"
                     src={user.image || "/avatar.png"}
                     alt={user.username || "User"}
                  />
                  <AvatarFallback>{(user.username || "U")[0]}</AvatarFallback>
               </Avatar>
            </motion.div>
            <div className="lg:col-span-2">
               {/* User details */}
               <div className="grid grid-cols-2 gap-3">
                  {stats.map((stat, index) => (
                     <motion.div key={stat.title} variants={fadeInUp} custom={index}>
                        <Card
                           className=" shadow-md border-0 backdrop-blur-sm transition-all duration-300">
                        <CardHeader className="flex flex-row gap-3 items-center">
                           <div className={`p-3 rounded-full ${stat.bgColor}`}>
                              <stat.icon className={`h-5 w-5 ${stat.color}`} />
                           </div>
                           <CardTitle className="text-sm font-medium">
                              {stat.title}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="text-md font-semibold border p-2 px-4 rounded-xl">
                              {stat.value}
                           </div>
                        </CardContent>
                     </Card>
                     </motion.div>
                  ))}
               </div>
               <div className="p-2 xl:flex gap-4 border rounded-xl mt-2 hidden ">
                  <MessageSquareWarning className="w-12 h-12 text-red-600" />
                  <p>
                     If you change your username, email, or password, the old
                     credentials will no longer be accessible. Make sure to
                     remember your new login information.
                  </p>
               </div>
            </div>
         </div>

         <motion.div variants={fadeInUp} className="w-full rounded-xl mt-2">
            {/* Edit button at the bottom */}
            <Sheet>
               <SheetTrigger asChild>
                  <Button className="w-full h-12" variant="default">
                     Edit Profile
                  </Button>
               </SheetTrigger>
               <EditUser
                  user={user}
                  onProfileUpdate={() => {
                     // Force a refresh of the session data
                     update();
                     // Also increment refresh key to force re-render
                     setRefreshKey((prev) => prev + 1);
                  }}
               />
            </Sheet>
         </motion.div>
      </motion.div>
   );
};

export default Setting;
