
import React, { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/compute/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { SubnetsSection } from '@/components/networking/SubnetsSection';
import { fetchSubnets } from '@/api/networkingApi';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const SubnetsPage: React.FC = () => {
  const [selectedSubnetId, setSelectedSubnetId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({
      title: "Refreshing subnet data",
      description: "The subnet information has been refreshed.",
    });
  };

  const handleAddResource = () => {
    toast({
      title: "Add Subnet",
      description: "This would open a dialog to add a new subnet.",
    });
  };

  const handleSubnetSelect = (subnetId: string) => {
    setSelectedSubnetId(subnetId);
    // Navigate to routes page with the subnet ID
    window.location.href = `/networking/routes?subnetId=${subnetId}`;
  };

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader 
        title="Subnet Management"
        description="Manage your network subnets and address allocations."
        onRefresh={handleRefresh}
        onAdd={handleAddResource}
        addButtonText="Add Subnet"
      />

      <Separator className="my-6" />

      <ErrorBoundary
        fallback={
          <div className="p-4 border rounded-md bg-red-50 text-red-600">
            <h3 className="text-lg font-medium">Error loading subnets</h3>
            <p>There was an error loading the subnet data. Please try refreshing the page.</p>
          </div>
        }
      >
        <Suspense fallback={<div>Loading subnets...</div>}>
          <SubnetsSection 
            onSubnetSelect={handleSubnetSelect}
            selectedSubnetId={selectedSubnetId}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default SubnetsPage;
