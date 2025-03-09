
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
import { Search } from "lucide-react";
import { fetchServers } from '@/api/dashboardApi';
import { ServerDetailSheet } from './ServerDetailSheet';
import { ServerData } from '@/api/types';

interface ServerListProps {
  vCenterId?: string;
  clusterId?: string;
  tagIds?: string[];
}

type ServerCategoryType = 'rke' | 'dogfood' | 'etcd' | 'nfs' | 'jenkins';

export const ServerList: React.FC<ServerListProps> = ({ vCenterId, clusterId, tagIds }) => {
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServerCategoryType>('rke');

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
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Server Status</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search servers..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rke" className="w-full" onValueChange={(value) => setSelectedCategory(value as ServerCategoryType)}>
            <TabsList className="mb-4 w-full md:w-auto">
              <TabsTrigger value="rke">RKE Control Planes</TabsTrigger>
              <TabsTrigger value="dogfood">Dogfood Clusters</TabsTrigger>
              <TabsTrigger value="etcd">etcd Clusters</TabsTrigger>
              <TabsTrigger value="nfs">NFS Hosts</TabsTrigger>
              <TabsTrigger value="jenkins">Jenkins Agent</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-0">
              {isLoading ? (
                <div className="h-80 w-full rounded-lg bg-muted/50 animate-pulse" />
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>CPU</TableHead>
                        <TableHead>Memory</TableHead>
                        <TableHead>Disk</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServers && filteredServers.length > 0 ? (
                        filteredServers.map((server) => (
                          <TableRow 
                            key={server.id} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleServerClick(server)}
                          >
                            <TableCell className="font-medium">{server.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(server.status)}`}></div>
                                <span className="capitalize">{server.status}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                {server.cpu}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                {server.memory}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                {server.disk}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                            {searchQuery ? 'No servers found matching your search' : 'No servers found'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
