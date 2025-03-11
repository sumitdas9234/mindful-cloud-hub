
import React from 'react';
import { Server } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Server className="h-10 w-10 text-muted-foreground mb-3" />,
  title,
  description
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-48">
      {icon}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
