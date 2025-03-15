
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/compute/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Network, GitBranch, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchSubnets } from '@/api/networkingApi';

const NetworkingPage: React.FC = () => {
  const { toast } = useToast();

  const { data: subnets = [], refetch: refetchSubnets } = useQuery({
    queryKey: ['subnets-summary'],
    queryFn: fetchSubnets,
  });

  const handleRefresh = () => {
    // Refresh data
    refetchSubnets();
    
    toast({
      title: "Refreshing network data",
      description: "The network information has been refreshed.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'inactive': return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'static': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'openshift': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  // Show only first 2 subnets in summary
  const displaySubnets = subnets.slice(0, 2);

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader 
        title="Network Management"
        description="An overview of your network resources, subnets, and routes."
        onRefresh={handleRefresh}
      />

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-primary mr-2" />
                <CardTitle>Subnets</CardTitle>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                {subnets.length} total
              </Badge>
            </div>
            <CardDescription>
              Manage and organize your network address space
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displaySubnets.length > 0 ? (
                displaySubnets.map(subnet => (
                  <div key={subnet.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <div className="font-medium">{subnet.name}</div>
                      <div className="text-sm text-muted-foreground">{subnet.cidr}</div>
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(subnet.status)}
                    >
                      {subnet.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  No subnets available
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/networking/subnets" className="w-full">
              <Button variant="outline" className="w-full">
                View All Subnets <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <GitBranch className="h-5 w-5 text-primary mr-2" />
                <CardTitle>Routes</CardTitle>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                0 total
              </Badge>
            </div>
            <CardDescription>
              Manage traffic paths between networks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-6 text-center text-muted-foreground">
              No routes available
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/networking/routes" className="w-full">
              <Button variant="outline" className="w-full">
                View All Routes <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NetworkingPage;
