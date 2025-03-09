
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ProgressRing } from '@/components/ui/progress-ring';
import { LucideIcon } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  value: number;
  icon?: LucideIcon;
  color?: string;
  textColor?: string;
  subtitle?: string;
  usageLabel?: string;
  total?: string;
  showProgress?: boolean;
  showProgressRing?: boolean;
  className?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  value,
  icon: Icon,
  color = "hsl(var(--primary))",
  textColor,
  subtitle,
  usageLabel,
  total,
  showProgress = true,
  showProgressRing = false,
  className,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {showProgressRing ? (
            <ProgressRing 
              value={currentValue} 
              size={80} 
              strokeWidth={6}
              color={color}
              className="mr-4"
            >
              <span className="text-lg font-bold">{currentValue}%</span>
            </ProgressRing>
          ) : null}
          
          <div className={cn("space-y-1 w-full", showProgressRing && "flex-1")}>
            <div className="flex items-end justify-between">
              <span className={cn("text-2xl font-bold", textColor)}>
                {usageLabel || `${currentValue}%`}
              </span>
              {total && (
                <span className="text-xs text-muted-foreground">
                  of {total}
                </span>
              )}
            </div>
            
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            
            {showProgress && (
              <Progress 
                value={currentValue} 
                className="h-2" 
                style={{ 
                  color: color !== "hsl(var(--primary))" ? color : undefined 
                }}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
