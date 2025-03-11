
import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description: string;
  onRefresh: () => void;
  onAdd?: () => void;
  addButtonText?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  onRefresh,
  onAdd,
  addButtonText
}) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        {onAdd && addButtonText && (
          <Button onClick={onAdd} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {addButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};
