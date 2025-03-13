
import React from 'react';
import { PageHeader } from '@/components/compute/PageHeader';
import { Separator } from '@/components/ui/separator';
import { ManagedServices } from '@/components/dashboard/sections/ManagedServices';

const AppsAndServices: React.FC = () => {
  return (
    <div className="container mx-auto space-y-6">
      <PageHeader 
        title="Apps and Services Management"
        description="Manage and monitor applications and services."
      />
      
      <Separator className="my-6" />
      
      <ManagedServices />
    </div>
  );
};

export default AppsAndServices;
