
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Box } from 'lucide-react';

interface EnvironmentData {
  name: string;
  value: number;
  color: string;
}

interface EnvironmentSummaryCardProps {
  environments: EnvironmentData[];
}

export const EnvironmentSummaryCard: React.FC<EnvironmentSummaryCardProps> = ({ environments }) => (
  <Card className="md:col-span-1">
    <CardHeader className="py-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">Environments</CardTitle>
        <Box className="h-4 w-4 text-muted-foreground" />
      </div>
    </CardHeader>
    <CardContent className="pt-0 pb-2">
      <div className="space-y-2">
        {environments.map(env => (
          <div key={env.name} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: env.color }}
              />
              <span className="text-xs">{env.name}</span>
            </div>
            <span className="text-xs font-medium">{env.value}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
