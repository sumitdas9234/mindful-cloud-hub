
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

export default PublicLayout;
