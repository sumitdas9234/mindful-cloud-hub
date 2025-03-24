
import React from 'react';
import { Server } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Server className="h-8 w-8 text-muted-foreground mb-2" />,
  title,
  description
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] relative overflow-hidden">
      {/* Background "PX" letters */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10">
        <span className="text-[25rem] font-bold text-primary leading-none">PX</span>
      </div>
      
      {/* Glass pane container */}
      <div className="glass-card p-10 z-10 rounded-xl flex flex-col items-center max-w-md">
        <div className="text-center flex flex-col items-center">
          <div className="flex justify-center mb-2">
            {icon}
          </div>
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
