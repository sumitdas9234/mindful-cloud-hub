
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TemplateOS } from '@/api/types/templates';
import { CheckCircle, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: TemplateOS;
  onClick: (template: TemplateOS) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick }) => {
  const latestVersion = template.versions.find(v => v.isLatest);
  const recommendedVersion = template.versions.find(v => v.isRecommended) || latestVersion;
  
  return (
    <Card className="h-full flex flex-col border hover:border-primary/50 hover:shadow-md transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
              {template.logoUrl ? (
                <img src={template.logoUrl} alt={template.name} className="h-8 w-8 object-contain" />
              ) : (
                <div className="h-8 w-8 bg-primary/10 flex items-center justify-center rounded">
                  <span className="text-sm font-medium text-primary">{template.name.substring(0, 2)}</span>
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {template.name}
                {template.isPopular && (
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    Popular
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs mt-1">{template.category.charAt(0).toUpperCase() + template.category.slice(1)}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-sm text-muted-foreground mb-3 h-10 line-clamp-2">{template.description}</div>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Latest version</div>
            <div className={cn(
              "text-sm font-medium flex items-center gap-1.5",
              latestVersion?.isRecommended && "text-green-600 dark:text-green-500"
            )}>
              {latestVersion?.isRecommended && <CheckCircle className="h-3.5 w-3.5" />}
              {latestVersion?.version} 
              {latestVersion?.releaseDate && (
                <span className="text-xs text-muted-foreground font-normal">
                  ({new Date(latestVersion.releaseDate).toLocaleDateString()})
                </span>
              )}
            </div>
          </div>
          
          {recommendedVersion && !recommendedVersion.isLatest && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Recommended version</div>
              <div className="text-sm font-medium text-green-600 dark:text-green-500 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                {recommendedVersion.version}
                {recommendedVersion.releaseDate && (
                  <span className="text-xs text-muted-foreground font-normal">
                    ({new Date(recommendedVersion.releaseDate).toLocaleDateString()})
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total versions</div>
            <div className="text-sm">{template.versions.length} version{template.versions.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-between"
          onClick={() => onClick(template)}
        >
          <span>View details</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
