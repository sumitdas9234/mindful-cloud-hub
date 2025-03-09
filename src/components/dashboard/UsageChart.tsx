
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface DataPoint {
  name: string;
  [key: string]: any;
}

interface UsageChartProps {
  title: string;
  data: DataPoint[];
  dataKeys: {
    key: string;
    name: string;
    color: string;
  }[];
  className?: string;
}

export const UsageChart: React.FC<UsageChartProps> = ({
  title,
  data,
  dataKeys,
  className,
}) => {
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value;
  };

  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full px-2 pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                {dataKeys.map((dataKey, index) => (
                  <linearGradient key={index} id={`color-${dataKey.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={dataKey.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={dataKey.color} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-md shadow-md p-3 animate-fade-in">
                        <p className="text-xs font-medium">{label}</p>
                        <div className="mt-1 space-y-1">
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center text-xs">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="font-medium">{entry.name}: </span>
                              <span className="ml-1">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {dataKeys.map((dataKey, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={dataKey.key}
                  name={dataKey.name}
                  stroke={dataKey.color}
                  fillOpacity={1}
                  fill={`url(#color-${dataKey.key})`}
                  strokeWidth={2}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
