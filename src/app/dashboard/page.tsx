"use client";
import Loading from "@/app/loading";
import AppAreaChart from "@/components/AppAreaChart";
import AppPieChart from "@/components/AppPieChart";
import { DashboardStats } from "@/components/DashboardStats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface MessageStats {
   month: string;
   messages: number;
}

interface MessageCount {
   name: string;
   value: number;
   fill: string;
}

interface DashboardData {
   totalMessages: number;
   recentMessages: number;
   growthRate: number;
}

const Dashboard = () => {
   const [isLoading, setLoading] = useState(false);
   const [profileUrl, setProfileUrl] = useState<string>("");
   const [areaChartData, setAreaChartData] = useState<MessageStats[]>([]);
   const [pieChartData, setPieChartData] = useState<MessageCount[]>([]);
   const [dashboardData, setDashboardData] = useState<DashboardData>({
      totalMessages: 0,
      recentMessages: 0,
      growthRate: 0,
   });
   const { data: session, status } = useSession();
   const username = session?.user.username;

   useEffect(() => {
      if (typeof window !== "undefined" && session?.user?.username) {
         const baseUrl = `${window.location.protocol}//${window.location.host}`;
         setProfileUrl(`${baseUrl}/u/${session.user.username}`);
      }
   }, [session]);

   useEffect(() => {
      // Fetch message statistics
      const fetchMessageStats = async () => {
         try {
            setLoading(true);
            const [statsResponse, countResponse] = await Promise.all([
               axios.get("/api/messages/stats"),
               axios.get("/api/messages/count"),
            ]);

            const statsData = statsResponse.data;
            const countData = countResponse.data;

            if (statsData.success && statsData.monthlyStats) {
               setAreaChartData(statsData.monthlyStats.slice(-6));
            }

            if (countData.success) {
               const total = countData.totalMessages || 0;
               const recent = countData.recentMessages || 0;

               setDashboardData({
                  totalMessages: total,
                  recentMessages: recent,
                  growthRate:
                     total > 0 ? Math.round((recent / total) * 100) : 0,
               });

               setPieChartData([
                  {
                     name: "Total Messages",
                     value: total,
                     fill: "var(--chart-5)",
                  },
                  {
                     name: "Recent Messages",
                     value: recent,
                     fill: "var(--chart-3)",
                  },
               ]);
            }
         } catch (error) {
            console.error("Error fetching message data:", error);
            toast.error("Failed to load dashboard data");
         } finally {
            setLoading(false);
         }
      };

      if (status === "authenticated") {
         fetchMessageStats();
      }
   }, [status]);

   //copy to clipboard
   const copyToClipboard = () => {
      navigator.clipboard.writeText(profileUrl);
      toast.success("URL copied");
   };

   if (status === "loading") {
      return <Loading />;
   }

   if (status === "unauthenticated") {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-lg">Please sign in to access your dashboard.</p>
         </div>
      );
   }

   return (
      <motion.div
         className="mx-1 md:mx-8 lg:mx-auto p-2 lg:p-6 rounded w-full max-w-6xl"
         initial="hidden"
         animate="visible"
         variants={staggerContainer}>
         <motion.h1
            className="text-4xl font-bold mb-4 text-center"
            variants={fadeInUp}>
            Welcome, {username}
         </motion.h1>
         <motion.div className="mb-4" variants={fadeInUp}>
            <h2 className="text-md font-semibold mb-2">
               Share Your Unique Link
            </h2>
            <div className="flex items-center">
               <Input
                  type="text"
                  value={profileUrl}
                  disabled
                  className="input input-bordered w-full p-2 mr-2"
               />
               <Button onClick={copyToClipboard}>Copy</Button>
            </div>
         </motion.div>
         <motion.div variants={fadeInUp}>
            <DashboardStats
               totalMessages={dashboardData.totalMessages}
               recentMessages={dashboardData.recentMessages}
               growthRate={dashboardData.growthRate}
               isLoading={isLoading}
            />
         </motion.div>
         <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-3  gap-4 mt-6"
            variants={fadeInUp}>
            <motion.div
               className="bg-primary-foreground p-4 rounded-lg shadow-md flex flex-col items-center justify-around"
               variants={fadeInUp}>
               <h1 className="font-semibold text-2xl ">Message Distribution</h1>
                     <AppPieChart
                        data={pieChartData}
                        totalMessages={dashboardData.totalMessages}
                        isLoading={isLoading}
                     />
            </motion.div>
            <motion.div
               className="bg-primary-foreground p-4 rounded-lg shadow-md lg:col-span-2 2xl:col-span-2"
               variants={fadeInUp}>
               <AppAreaChart
                  data={areaChartData}
                  title="Monthly Message Trend"
                  isLoading={isLoading}
               />
            </motion.div>
         </motion.div>
      </motion.div>
   );
};

export default Dashboard;
