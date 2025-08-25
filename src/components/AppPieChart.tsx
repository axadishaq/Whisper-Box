"use client";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
   type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell, Label } from "recharts";

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
}

const AppPieChart = ({ data, totalMessages }: AppPieChartProps) => {
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
      <ChartContainer
         config={chartConfig}
         className="min-h-[250px] max-h-[400px] w-full mt-10">
         <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
               data={data}
               dataKey="value"
               nameKey="name"
               innerRadius={60}
               outerRadius={90}
               fill="var(--color-messages)"
               label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
               }
               animationDuration={2500}
               animationEasing="ease-in-out">
               {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
               ))}
               <Label
                  content={({ viewBox }) => {
                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                           <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle">
                              <tspan
                                 x={viewBox.cx}
                                 y={viewBox.cy}
                                 className="fill-foreground text-3xl font-bold">
                                 {totalMessages.toLocaleString()}
                              </tspan>
                              <tspan
                                 x={viewBox.cx}
                                 y={(viewBox.cy || 0) + 24}
                                 className="fill-muted-foreground">
                                 Total Messages
                              </tspan>
                           </text>
                        );
                     }
                  }}
               />
            </Pie>
         </PieChart>
      </ChartContainer>
   );
};

export default AppPieChart;
