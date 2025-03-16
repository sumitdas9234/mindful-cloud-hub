
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

const RADIAN = Math.PI / 180;

const CustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label if segment is large enough
  if (percent < 0.08) return null;
  
  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {value}
    </text>
  );
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <div className="flex flex-wrap justify-center gap-4 pt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export const DistributionChart: React.FC<DistributionChartProps> = ({ 
  title, 
  data,
  size = 'small'
}) => {
  const chartHeight = size === 'small' ? 250 : 350;
  const outerRadius = size === 'small' ? 80 : 120;
  const innerRadius = outerRadius * 0.6; // Add inner radius for donut chart
  
  return (
    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-card/80">
      <CardHeader className="py-4 bg-card/5">
        <CardTitle className={size === 'small' ? 'text-base' : undefined}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: chartHeight, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={CustomizedLabel}
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
                animationDuration={1500}
                animationBegin={0}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${value} testbeds`, 'Count']}
                contentStyle={{
                  borderRadius: '8px',
                  backgroundColor: 'hsl(var(--card))',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  border: '1px solid hsl(var(--border))',
                  padding: '8px 12px',
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
