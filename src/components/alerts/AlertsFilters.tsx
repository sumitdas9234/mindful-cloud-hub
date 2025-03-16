
import React from 'react';
import { Filter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertStatus, AlertSeverity } from '@/api/types/alerts';

interface AlertsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatuses: AlertStatus[];
  setSelectedStatuses: (statuses: AlertStatus[]) => void;
  selectedSeverities: AlertSeverity[];
  setSelectedSeverities: (severities: AlertSeverity[]) => void;
  resetFilters: () => void;
}

export const AlertsFilters: React.FC<AlertsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatuses,
  setSelectedStatuses,
  selectedSeverities,
  setSelectedSeverities,
  resetFilters,
}) => {
  const hasFilters = selectedStatuses.length > 0 || selectedSeverities.length > 0;

  const toggleStatus = (status: AlertStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const toggleSeverity = (severity: AlertSeverity) => {
    if (selectedSeverities.includes(severity)) {
      setSelectedSeverities(selectedSeverities.filter(s => s !== severity));
    } else {
      setSelectedSeverities([...selectedSeverities, severity]);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search alerts..."
            className="w-full rounded-md pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-2.5 top-2.5 text-muted-foreground"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={hasFilters ? "border-primary text-primary" : ""}>
                <Filter className="h-4 w-4 mr-1" />
                Filter
                {hasFilters && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 px-1 py-0 h-5"
                  >
                    {selectedStatuses.length + selectedSeverities.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter By Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={selectedStatuses.includes('firing')}
                onCheckedChange={() => toggleStatus('firing')}
              >
                Firing
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedStatuses.includes('pending')}
                onCheckedChange={() => toggleStatus('pending')}
              >
                Pending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedStatuses.includes('resolved')}
                onCheckedChange={() => toggleStatus('resolved')}
              >
                Resolved
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Filter By Severity</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={selectedSeverities.includes('critical')}
                onCheckedChange={() => toggleSeverity('critical')}
              >
                Critical
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedSeverities.includes('high')}
                onCheckedChange={() => toggleSeverity('high')}
              >
                High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedSeverities.includes('medium')}
                onCheckedChange={() => toggleSeverity('medium')}
              >
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedSeverities.includes('low')}
                onCheckedChange={() => toggleSeverity('low')}
              >
                Low
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedSeverities.includes('info')}
                onCheckedChange={() => toggleSeverity('info')}
              >
                Info
              </DropdownMenuCheckboxItem>
              
              {hasFilters && (
                <>
                  <DropdownMenuSeparator />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full flex justify-center items-center mt-1"
                    onClick={resetFilters}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear filters
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedStatuses.map(status => (
            <Badge 
              key={`status-${status}`}
              variant="secondary"
              className="flex gap-1 items-center pl-2"
            >
              Status: {status}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0 text-muted-foreground"
                onClick={() => toggleStatus(status)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {selectedSeverities.map(severity => (
            <Badge 
              key={`severity-${severity}`}
              variant="secondary"
              className="flex gap-1 items-center pl-2"
            >
              Severity: {severity}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0 text-muted-foreground"
                onClick={() => toggleSeverity(severity)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground h-6"
            onClick={resetFilters}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};
