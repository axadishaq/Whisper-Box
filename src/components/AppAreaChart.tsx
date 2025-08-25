"use client";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
   type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
   messages: {
      label: "Messages",
      color: "var(--chart-2)",
   },
} satisfies ChartConfig;

interface MessageStats {
   month: string;
   messages: number;
}

interface AppAreaChartProps {
   data: MessageStats[];
   title?: string;
}

const AppAreaChart = ({
   data,
   title = "Messages Trend",
}: AppAreaChartProps) => {
   if (!data || data.length === 0) {
      return (
         <div className=" p-6 rounded-xl border border-border/30">
            <h1 className="text-xl font-semibold mb-4 text-foreground">
               {title}
            </h1>
            <div className="min-h-[250px] max-h-[400px] w-full flex items-center justify-center">
               <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/20 flex items-center justify-center">
                     <svg
                        className="w-6 h-6 text-muted-foreground/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                     </svg>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                     No message data available
                  </p>
               </div>
            </div>
         </div>
      );
   }

   // Add padding data points to make the chart start from the edges
   const paddedData = [
      { month: data[0]?.month || "", messages: 0 },
      ...data,
      { month: data[data.length - 1]?.month || "", messages: 0 },
   ];

   return (
      <div >
         <h1 className="text-xl font-medium mb-6 ">{title}</h1>
         <ChartContainer
            config={chartConfig}
            className="min-h-[200px] max-h-[300px] w-full">
            <AreaChart accessibilityLayer data={paddedData}>
               <defs>
                  <linearGradient id="fillMessages" x1="0" y1="0" x2="0" y2="1">
                     <stop
                        offset="0%"
                        stopColor="var(--color-messages)"
                        stopOpacity={0.6}
                     />
                     <stop
                        offset="50%"
                        stopColor="var(--color-messages)"
                        stopOpacity={0.3}
                     />
                     <stop
                        offset="100%"
                        stopColor="var(--color-messages)"
                        stopOpacity={0.05}
                     />
                  </linearGradient>
               </defs>

               <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--color-messages)"
                  strokeOpacity={0.1}
               />

               <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={12}
                  axisLine={false}
                  tickFormatter={(value, index) => {
                     if (index === 0 || index === paddedData.length - 1)
                        return "";
                     const date = new Date(value + "-01");
                     return date.toLocaleDateString("en-US", {
                        month: "short",
                        year: "2-digit",
                     });
                  }}
                  className="text-xs"
               />

               <YAxis
                  tickLine={false}
                  tickMargin={8}
                  axisLine={false}
                  tickFormatter={(value) => {
                     if (value === 0) return "";
                     if (value >= 1000) {
                        return `${(value / 1000).toFixed(1)}k`;
                     }
                     return value.toString();
                  }}
                  className="text-xs"
               />

               <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{
                     stroke: "var(--color-messages)",
                     strokeOpacity: 0.2,
                     strokeWidth: 2,
                  }}
               />

               <Area
                  dataKey="messages"
                  type="monotone"
                  fill="url(#fillMessages)"
                  fillOpacity={1}
                  stroke="var(--color-messages)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={false}
                  activeDot={{
                     r: 5,
                     fill: "var(--color-messages)",
                     stroke: "hsl(var(--background))",
                     strokeWidth: 2,
                  }}
                  animationDuration={2500}
                  animationEasing="ease-in-out"
               />
            </AreaChart>
         </ChartContainer>
      </div>
   );
};

export default AppAreaChart;
