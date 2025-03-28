
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTemplates, fetchTemplateStats } from '@/api/templatesApi';
import { TemplateOS, TemplateFilters } from '@/api/types/templates';
import { TemplateStatsCard } from '@/components/templates/TemplateStats';
import { TemplateFiltersComponent } from '@/components/templates/TemplateFilters';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { TemplateDetailSheet } from '@/components/templates/TemplateDetailSheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Templates: React.FC = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<TemplateFilters>({
    category: 'all',
    search: '',
    showOnlyRecommended: false,
    showOnlyLatest: false
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOS | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  // Fetch templates with the current filters
  const { data: templates = [], isLoading: isTemplatesLoading, refetch: refetchTemplates } = useQuery({
    queryKey: ['templates', filters],
    queryFn: () => fetchTemplates(filters)
  });

  // Fetch template stats
  const { data: templateStats, isLoading: isStatsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['template-stats'],
    queryFn: fetchTemplateStats
  });

  const handleFilterChange = (newFilters: TemplateFilters) => {
    setFilters(newFilters);
  };

  const handleTemplateClick = (template: TemplateOS) => {
    setSelectedTemplate(template);
    setIsDetailSheetOpen(true);
  };

  const handleCloseDetailSheet = () => {
    setIsDetailSheetOpen(false);
  };

  const handleRefresh = () => {
    refetchTemplates();
    refetchStats();
    toast({
      title: "Refreshed templates",
      description: "Templates list has been refreshed"
    });
  };

  return (
    <div className="container mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">VM Templates</h1>
          <p className="text-muted-foreground">Manage and deploy virtual machine templates</p>
          <div className="text-sm text-muted-foreground">
            {templates.length} templates found
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Template Stats */}
      <div className="mb-6">
        <TemplateStatsCard
          stats={templateStats || { total: 0, linux: 0, windows: 0, other: 0, recent: 0 }}
          isLoading={isStatsLoading}
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TemplateFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          totalCount={templates.length}
        />
      </div>

      {/* Templates Grid */}
      <ScrollArea className="h-[calc(100vh-350px)]">
        {isTemplatesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-64 rounded-md border bg-muted animate-pulse" />
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="py-8 text-center">
            <h3 className="text-lg font-medium">No templates found</h3>
            <p className="text-muted-foreground">
              Try changing your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={handleTemplateClick}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Template Detail Sheet */}
      <TemplateDetailSheet
        template={selectedTemplate}
        isOpen={isDetailSheetOpen}
        onClose={handleCloseDetailSheet}
      />
    </div>
  );
};

export default Templates;
