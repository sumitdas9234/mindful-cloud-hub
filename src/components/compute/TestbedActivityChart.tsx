
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

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
    <Card className="col-span-2">
      <CardHeader className="py-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="h-[90px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activityData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <Tooltip 
                formatter={(value) => [`${value} testbeds`, 'Count']}
                labelFormatter={(label) => `${label}`}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Activity over last 24 hours</p>
      </CardContent>
    </Card>
  );
};
