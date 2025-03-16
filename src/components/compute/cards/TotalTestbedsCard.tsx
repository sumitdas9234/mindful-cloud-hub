
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Layers } from 'lucide-react';

interface TotalTestbedsCardProps {
  total: number;
  whitelisted: number;
}

export const TotalTestbedsCard: React.FC<TotalTestbedsCardProps> = ({ total, whitelisted }) => (
  <Card className="md:col-span-1 overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-card/80">
    <CardHeader className="py-4 bg-card/5">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">Total Testbeds</CardTitle>
        <Layers className="h-4 w-4 text-muted-foreground" />
      </div>
    </CardHeader>
    <CardContent className="pt-2 pb-4">
      <div className="text-3xl font-bold">{total}</div>
      <div className="flex items-center mt-2">
        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
        <p className="text-xs text-muted-foreground">
          {whitelisted} whitelisted
        </p>
      </div>
    </CardContent>
  </Card>
);
