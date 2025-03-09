
import React from 'react';
import { Clock } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">Cloud Overview</h2>
      <div className="flex items-center text-muted-foreground text-sm">
        <Clock className="h-4 w-4 mr-1" />
        <span>Last updated: {currentTime.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};
