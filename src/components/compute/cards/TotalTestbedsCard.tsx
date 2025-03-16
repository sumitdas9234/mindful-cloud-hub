
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Layers } from 'lucide-react';

interface TotalTestbedsCardProps {
  total: number;
  whitelisted: number;
}

export const TotalTestbedsCard: React.FC<TotalTestbedsCardProps> = ({ total, whitelisted }) => (
  <Card className="md:col-span-1">
    <CardHeader className="py-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">Total Testbeds</CardTitle>
        <Layers className="h-4 w-4 text-muted-foreground" />
      </div>
    </CardHeader>
    <CardContent className="pt-0 pb-2">
      <div className="text-2xl font-bold">{total}</div>
      <p className="text-xs text-muted-foreground mt-1">
        {whitelisted} whitelisted
      </p>
    </CardContent>
  </Card>
);
