
import React from 'react';
import { PageHeader } from '@/components/compute/PageHeader';
import { Separator } from '@/components/ui/separator';
import { ManagedServices } from '@/components/dashboard/sections/ManagedServices';
import { useToast } from '@/hooks/use-toast';

const AppsAndServices: React.FC = () => {
  const { toast } = useToast();
  
  const handleRefresh = () => {
    toast({
      title: "Refreshing data",
      description: "Apps and services data is being refreshed.",
    });
  };

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader 
        title="Apps and Services Management"
        description="Manage and monitor applications and services."
        onRefresh={handleRefresh}
      />
      
      <Separator className="my-6" />
      
      <ManagedServices />
    </div>
  );
};

export default AppsAndServices;
