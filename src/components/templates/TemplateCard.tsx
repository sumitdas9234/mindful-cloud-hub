
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

  // Function to determine which font-logos icon to use based on template name
  const getDistroIcon = (templateName: string) => {
    const name = templateName.toLowerCase();
    
    if (name.includes('ubuntu')) return 'fl-ubuntu';
    if (name.includes('debian')) return 'fl-debian';
    if (name.includes('fedora')) return 'fl-fedora';
    if (name.includes('centos')) return 'fl-centos';
    if (name.includes('arch')) return 'fl-archlinux';
    if (name.includes('alpine')) return 'fl-alpine';
    if (name.includes('redhat') || name.includes('rhel')) return 'fl-redhat';
    if (name.includes('suse') || name.includes('sles')) return 'fl-opensuse';
    if (name.includes('rocky')) return 'fl-rocky-linux';
    if (name.includes('gentoo')) return 'fl-gentoo';
    if (name.includes('flatcar')) return 'fl-tux';
    if (name.includes('photon')) return 'fl-vmware';
    
    // Default icon if no match
    return 'fl-tux';
  };
  
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
                <span className={`${getDistroIcon(template.name)} text-lg`}></span>
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
