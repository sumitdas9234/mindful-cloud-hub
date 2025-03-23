
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TemplateOS } from '@/api/types/templates';
import { Separator } from '@/components/ui/separator';
import { ServerIcon, Check, X, AlertTriangle } from 'lucide-react';

interface TemplateCardProps {
  template: TemplateOS;
  onClick: (template: TemplateOS) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick }) => {
  const latestVersion = template.versions.find(v => v.isLatest) || template.versions[0];
  const recommendedVersion = template.versions.find(v => v.isRecommended);
  
  const getVCenterAvailabilityStatus = () => {
    if (!template.vCenterAvailability || template.vCenterAvailability.length === 0) {
      return { icon: AlertTriangle, color: 'text-gray-400', text: 'Unknown' };
    }
    
    const availableCount = template.vCenterAvailability.filter(vc => vc.isAvailable).length;
    const totalCount = template.vCenterAvailability.length;
    
    if (availableCount === totalCount) {
      return { icon: Check, color: 'text-green-500', text: 'All vCenters' };
    } else if (availableCount === 0) {
      return { icon: X, color: 'text-red-500', text: 'No vCenters' };
    } else {
      return { 
        icon: AlertTriangle, 
        color: 'text-amber-500', 
        text: `${availableCount}/${totalCount} vCenters` 
      };
    }
  };
  
  const vcStatus = getVCenterAvailabilityStatus();
  const VCIcon = vcStatus.icon;
  
  return (
    <Card 
      className="hover:border-primary/50 transition-colors cursor-pointer h-full flex flex-col"
      onClick={() => onClick(template)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center overflow-hidden">
              {template.logoUrl ? (
                <img src={template.logoUrl} alt={template.name} className="h-6 w-6 object-contain" />
              ) : (
                <div className="h-6 w-6 bg-primary/10 flex items-center justify-center rounded">
                  <span className="text-xs font-medium text-primary">{template.name.substring(0, 2)}</span>
                </div>
              )}
            </div>
            <CardTitle className="text-base">{template.name}</CardTitle>
          </div>
          {template.isPopular && (
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800">
              Popular
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Latest version:</span>
            <span className="text-xs font-medium">{latestVersion?.version || 'N/A'}</span>
          </div>
          
          {recommendedVersion && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Recommended:</span>
              <span className="text-xs font-medium">{recommendedVersion.version}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Kernel versions:</span>
            <span className="text-xs font-medium">{latestVersion?.kernels.length || 0}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Category:</span>
            <Badge variant="outline" className="text-xs">
              {template.category}
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <ServerIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Availability:</span>
          </div>
          <div className={`flex items-center gap-1 ${vcStatus.color}`}>
            <VCIcon className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{vcStatus.text}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
