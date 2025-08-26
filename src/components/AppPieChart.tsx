"use client";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
   type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import AnimatedCounter from "@/components/AnimatedCounter";

const chartConfig = {
   messages: {
      label: "Messages",
      color: "var(--chart-1)",
   },
} satisfies ChartConfig;

interface MessageCount {
   name: string;
   value: number;
   fill: string;
}

interface AppPieChartProps {
   data: MessageCount[];
   totalMessages: number;
   isLoading?: boolean;
}

const AppPieChart = ({ data, totalMessages, isLoading = false }: AppPieChartProps) => {
   if (isLoading) {
      return (
         <div className="relative min-h-[250px] max-h-[400px] w-full mt-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
         </div>
      );
   }
   
   if (!data || data.length === 0) {
      return (
         <div>
            <div className="min-h-[200px] max-h-[400px] w-full flex items-center justify-center">
               <div className="text-muted-foreground">
                  No message data available
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="relative h-[300px] w-full mt-6">
         <ChartContainer config={chartConfig} className="w-full h-full flex items-center justify-center">
            <PieChart width={250} height={250}>
               <ChartTooltip content={<ChartTooltipContent />} />
               <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="var(--color-messages)"
                  label={({ name, percent }) =>
                     `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  animationDuration={4000}
                  animationEasing="ease-in-out">
                  {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
               </Pie>
            </PieChart>
         </ChartContainer>

         {/* Custom overlay for animated counter */}
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-3xl font-bold text-foreground">
               <AnimatedCounter value={totalMessages} duration={4} />
            </div>
            <div className="text-muted-foreground mt-1 text-sm">Total Messages</div>
         </div>
      </div>
   );
};

export default AppPieChart;
