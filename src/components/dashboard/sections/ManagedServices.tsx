
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchServers } from '@/api/dashboardApi';
import { ServerDetailSheet } from './ServerDetailSheet';
import { ServerData } from '@/api/types';

interface ManagedServicesProps {
  vCenterId?: string;
  clusterId?: string;
  tagIds?: string[];
}

type ServerCategoryType = 'rke' | 'dogfood' | 'etcd' | 'nfs' | 'jenkins';

export const ManagedServices: React.FC<ManagedServicesProps> = ({ vCenterId, clusterId, tagIds }) => {
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServerCategoryType>('rke');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to show per page

  const { data: servers, isLoading } = useQuery({
    queryKey: ['servers', vCenterId, clusterId, tagIds, selectedCategory],
    queryFn: () => fetchServers({ 
      vCenterId, 
      clusterId, 
      tagIds,
      category: selectedCategory 
    }),
    refetchInterval: 30000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleServerClick = (server: ServerData) => {
    setSelectedServer(server);
    setDetailSheetOpen(true);
  };

  // Filter servers based on search query
  const filteredServers = servers?.filter(server => 
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredServers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredServers.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Prevent default on tab click to avoid scroll to top
  const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>, value: string) => {
    e.preventDefault();
    setSelectedCategory(value as ServerCategoryType);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Managed Services</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rke" className="w-full">
            <TabsList className="mb-4 w-full md:w-auto overflow-x-auto flex-nowrap">
              <TabsTrigger 
                value="rke" 
                onClick={(e) => handleTabClick(e, 'rke')}
              >
                RKE Control Planes
              </TabsTrigger>
              <TabsTrigger 
                value="dogfood" 
                onClick={(e) => handleTabClick(e, 'dogfood')}
              >
                Dogfood Clusters
              </TabsTrigger>
              <TabsTrigger 
                value="etcd" 
                onClick={(e) => handleTabClick(e, 'etcd')}
              >
                etcd Clusters
              </TabsTrigger>
              <TabsTrigger 
                value="nfs" 
                onClick={(e) => handleTabClick(e, 'nfs')}
              >
                NFS Hosts
              </TabsTrigger>
              <TabsTrigger 
                value="jenkins" 
                onClick={(e) => handleTabClick(e, 'jenkins')}
              >
                Jenkins Agent
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-0">
              {isLoading ? (
                <div className="h-80 w-full rounded-lg bg-muted/50 animate-pulse" />
              ) : (
                <div className="rounded-md border">
                  <div className="max-h-[420px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>CPU</TableHead>
                          <TableHead>Memory</TableHead>
                          <TableHead>Disk</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((server) => (
                            <TableRow 
                              key={server.id} 
                              className="bg-white dark:bg-secondary/20 cursor-pointer hover:bg-muted/50"
                              onClick={() => handleServerClick(server)}
                            >
                              <TableCell className="font-medium py-3">{server.name}</TableCell>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-2">
                                  <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(server.status)}`}></div>
                                  <span className="capitalize">{server.status}</span>
                                </div>
                              </TableCell>
                              <TableCell className="py-3">
                                <Badge variant="outline" className="font-mono">
                                  {server.cpu}%
                                </Badge>
                              </TableCell>
                              <TableCell className="py-3">
                                <Badge variant="outline" className="font-mono">
                                  {server.memory}%
                                </Badge>
                              </TableCell>
                              <TableCell className="py-3">
                                <Badge variant="outline" className="font-mono">
                                  {server.disk}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                              {searchQuery ? 'No services found matching your search' : 'No services found'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  {filteredServers.length > 0 && (
                    <div className="flex items-center justify-between p-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Showing {filteredServers.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredServers.length)} of {filteredServers.length} entries
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous Page</span>
                        </Button>
                        <div className="text-sm">
                          Page {currentPage} of {totalPages || 1}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={currentPage >= totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next Page</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ServerDetailSheet 
        server={selectedServer}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </>
  );
};
