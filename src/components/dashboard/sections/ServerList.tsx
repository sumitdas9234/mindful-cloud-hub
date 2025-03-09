
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchServers } from '@/api/dashboardApi';

interface ServerListProps {
  vCenterId?: string;
  clusterId?: string;
}

export const ServerList: React.FC<ServerListProps> = ({ vCenterId, clusterId }) => {
  const { data: servers, isLoading } = useQuery({
    queryKey: ['servers', vCenterId, clusterId],
    queryFn: () => fetchServers(vCenterId, clusterId),
    refetchInterval: 60000, // Refetch every minute
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Active Servers</h3>
        <button className="text-sm text-primary font-medium hover:underline">View all servers</button>
      </div>
      
      {isLoading ? (
        <div className="h-64 rounded-lg bg-muted/50 animate-pulse" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Server Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">CPU</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Memory</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Disk</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {servers?.map((server) => (
                  <tr key={server.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{server.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-secondary rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${server.cpu}%` }}
                          />
                        </div>
                        <span>{server.cpu}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-secondary rounded-full h-2 mr-2">
                          <div 
                            className="bg-[hsl(217,91%,60%)] h-2 rounded-full" 
                            style={{ width: `${server.memory}%` }}
                          />
                        </div>
                        <span>{server.memory}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-secondary rounded-full h-2 mr-2">
                          <div 
                            className="bg-[hsl(330,87%,66%)] h-2 rounded-full" 
                            style={{ width: `${server.disk}%` }}
                          />
                        </div>
                        <span>{server.disk}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          server.status === 'online' ? 'bg-green-500' :
                          server.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <span>{server.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
