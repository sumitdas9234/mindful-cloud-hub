
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateFilters } from '@/api/types/templates';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Filter, Search, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface TemplateFiltersProps {
  filters: TemplateFilters;
  onFilterChange: (filters: TemplateFilters) => void;
  totalCount: number;
}

export const TemplateFiltersComponent: React.FC<TemplateFiltersProps> = ({
  filters,
  onFilterChange,
  totalCount
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({
      ...filters,
      category: value as 'linux' | 'windows' | 'other' | 'all'
    });
  };

  const handleRecommendedChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      onFilterChange({ ...filters, showOnlyRecommended: checked });
    }
  };

  const handleLatestChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      onFilterChange({ ...filters, showOnlyLatest: checked });
    }
  };

  const handleClearFilters = () => {
    onFilterChange({
      category: 'all',
      search: '',
      showOnlyRecommended: false,
      showOnlyLatest: false
    });
  };

  const hasActiveFilters = 
    (filters.search && filters.search.length > 0) || 
    filters.showOnlyRecommended || 
    filters.showOnlyLatest || 
    (filters.category && filters.category !== 'all');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-9"
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs 
          defaultValue={filters.category || 'all'} 
          value={filters.category || 'all'}
          onValueChange={handleCategoryChange}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="linux">Linux</TabsTrigger>
            <TabsTrigger value="windows">Windows</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="recommended" 
              checked={filters.showOnlyRecommended || false}
              onCheckedChange={handleRecommendedChange}
            />
            <Label htmlFor="recommended" className="text-sm text-muted-foreground cursor-pointer">
              Recommended
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox 
              id="latest" 
              checked={filters.showOnlyLatest || false}
              onCheckedChange={handleLatestChange}
            />
            <Label htmlFor="latest" className="text-sm text-muted-foreground cursor-pointer">
              Latest versions
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {hasActiveFilters && (
            <>
              <Badge variant="outline" className="flex items-center gap-1 bg-muted/40">
                <Filter className="h-3 w-3" />
                Filtered
              </Badge>
              
              {filters.category && filters.category !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-muted/40">
                  {filters.category}
                </Badge>
              )}
              
              {filters.showOnlyRecommended && (
                <Badge variant="outline" className="flex items-center gap-1 bg-muted/40">
                  <CheckCircle className="h-3 w-3" />
                  Recommended
                </Badge>
              )}
              
              {filters.showOnlyLatest && (
                <Badge variant="outline" className="flex items-center gap-1 bg-muted/40">
                  <Clock className="h-3 w-3" />
                  Latest versions
                </Badge>
              )}
            </>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{totalCount}</span> templates
        </div>
      </div>
    </div>
  );
};
