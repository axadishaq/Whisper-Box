"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, TrendingUp, Clock } from "lucide-react";

interface DashboardStatsProps {
   totalMessages: number;
   recentMessages: number;
   growthRate: number;
}

export function DashboardStats({
   totalMessages,
   recentMessages,
   growthRate,
}: DashboardStatsProps) {
   const stats = [
      {
         title: "Total Messages",
         value: totalMessages.toLocaleString(),
         icon: MessageSquare,
         color: "text-blue-500",
         bgColor: "bg-blue-50 dark:bg-blue-900/20",
      },
      {
         title: "Recent Messages",
         value: recentMessages.toLocaleString(),
         icon: Clock,
         color: "text-green-500",
         bgColor: "bg-green-50 dark:bg-green-900/20",
      },
      {
         title: "Growth Rate",
         value: `${growthRate > 0 ? "+" : ""}${growthRate}%`,
         icon: TrendingUp,
         color: growthRate > 0 ? "text-emerald-500" : "text-red-500",
         bgColor:
            growthRate > 0
               ? "bg-emerald-50 dark:bg-emerald-900/20"
               : "bg-red-50 dark:bg-red-900/20",
      },
   ];

   return (
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
         {stats.map((stat) => (
            <Card
               key={stat.title}
               className="shadow-lg ">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                     {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                     <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
               </CardContent>
            </Card>
         ))}
      </div>
   );
}
