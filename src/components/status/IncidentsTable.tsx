
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TablePagination } from '@/components/compute/TablePagination';
import { Skeleton } from '@/components/ui/skeleton';

export interface Incident {
  id: string;
  title: string;
  system: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  started: string;
  updated?: string;
  resolved?: string;
}

interface IncidentsTableProps {
  incidents: Incident[];
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalIncidents: number;
  onViewIncident: (incident: Incident) => void;
}

export const IncidentsTable: React.FC<IncidentsTableProps> = ({
  incidents,
  isLoading,
  currentPage,
  setCurrentPage,
  totalPages,
  totalIncidents,
  onViewIncident
}) => {
  if (isLoading) {
    return <IncidentTableSkeleton />;
  }

  if (incidents.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/30 border rounded-md">
        <p className="text-muted-foreground">No incidents reported</p>
      </div>
    );
  }

  const getStatusColor = (status: Incident['status']) => {
    switch (status) {
      case 'investigating': return 'bg-orange-500';
      case 'identified': return 'bg-blue-500';
      case 'monitoring': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Incident</TableHead>
            <TableHead>System</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Started</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow 
              key={incident.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onViewIncident(incident)}
            >
              <TableCell>
                <div className="font-medium">{incident.title}</div>
                <div className="text-sm text-muted-foreground truncate max-w-xs">
                  {incident.description}
                </div>
              </TableCell>
              <TableCell>{incident.system}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className="capitalize inline-flex items-center gap-1 w-fit"
                >
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(incident.status)}`}></span>
                  {incident.status}
                </Badge>
              </TableCell>
              <TableCell>{incident.started}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={5}
        totalItems={totalIncidents}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

const IncidentTableSkeleton = () => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Incident</TableHead>
            <TableHead>System</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Started</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(5).fill(0).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-64" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-7 w-7 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

