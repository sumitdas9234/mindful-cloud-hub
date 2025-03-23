
import React from 'react';
import {
  Archive,
  Boxes,
  Clock,
  Monitor,
  Server
} from 'lucide-react';
import { TemplateStats } from '@/api/types/templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateStatsCardProps {
  stats: TemplateStats;
  isLoading?: boolean;
}

export const TemplateStatsCard: React.FC<TemplateStatsCardProps> = ({ stats, isLoading = false }) => {
  const statItems = [
    {
      title: 'Total Templates',
      value: stats.total,
      icon: <Boxes className="h-4 w-4 text-primary" />,
      description: 'Available templates'
    },
    {
      title: 'Linux Templates',
      value: stats.linux,
      icon: <Server className="h-4 w-4 text-green-500" />,
      description: 'Linux distributions'
    },
    {
      title: 'Windows Templates',
      value: stats.windows,
      icon: <Monitor className="h-4 w-4 text-blue-500" />,
      description: 'Windows versions'
    },
    {
      title: 'Other Templates',
      value: stats.other,
      icon: <Archive className="h-4 w-4 text-amber-500" />,
      description: 'Special purpose OS'
    },
    {
      title: 'Recent Updates',
      value: stats.recent,
      icon: <Clock className="h-4 w-4 text-purple-500" />,
      description: 'Updated in last 30 days'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item) => (
        <Card key={item.title} className="border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              {item.icon}
            </div>
            <CardDescription className="text-xs">{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div> : 
                item.value
              }
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
