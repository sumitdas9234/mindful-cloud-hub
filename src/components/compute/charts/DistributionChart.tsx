
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface DistributionChartProps {
  title: string;
  data: ChartData[];
  size?: 'small' | 'large';
}

const CustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;
  
  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor='middle' 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {value}
    </text>
  );
};

export const DistributionChart: React.FC<DistributionChartProps> = ({ 
  title, 
  data,
  size = 'small'
}) => {
  const chartHeight = size === 'small' ? 300 : 400;
  const outerRadius = size === 'small' ? 80 : 120;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className={size === 'small' ? 'text-base' : undefined}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`h-[${chartHeight}px]`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomizedLabel}
                outerRadius={outerRadius}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${value} testbeds`, 'Count']}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
