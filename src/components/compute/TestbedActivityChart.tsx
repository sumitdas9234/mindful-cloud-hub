
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for testbed activity over 24 hours
const generateActivityData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    
    // Generate mock data - in a real app this would come from an API
    data.push({
      hour: `${time.getHours()}:00`,
      count: Math.floor(Math.random() * 5) + 20, // Random value between 20-25
    });
  }
  
  return data;
};

interface TestbedActivityChartProps {
  title?: string;
}

export const TestbedActivityChart: React.FC<TestbedActivityChartProps> = ({ 
  title = "Testbed Count (24h)" 
}) => {
  // In a real application, this would be fetched from an API
  const activityData = generateActivityData();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activityData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: 10 }} 
                tickFormatter={(value) => value.split(':')[0]}
                interval="preserveStartEnd"
              />
              <YAxis hide />
              <Tooltip 
                formatter={(value) => [`${value} testbeds`, 'Count']}
                labelFormatter={(label) => `${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorCount)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
