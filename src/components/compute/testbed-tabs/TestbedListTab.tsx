
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DataTable, Column } from '@/components/compute/DataTable';
import { SearchBar } from '@/components/compute/SearchBar';
import { TableSkeleton } from '@/components/ui/skeleton';
import { TestbedActionMenu } from '../TestbedActionMenu';
import { Testbed, getEnvironmentBadgeColor } from '../testbedUtils';

interface TestbedListTabProps {
  testbeds: Testbed[];
  filteredTestbeds: Testbed[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  onTestbedAction: (action: string, testbed: Testbed) => void;
  onViewDetails: (testbed: Testbed) => void;
}

export const TestbedListTab: React.FC<TestbedListTabProps> = ({
  testbeds,
  filteredTestbeds,
  searchQuery,
  setSearchQuery,
  isLoading,
  onTestbedAction,
  onViewDetails
}) => {
  const columns: Column<Testbed>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (testbed) => <span className="font-medium">{testbed.name}</span>
    },
    {
      key: 'environment',
      header: 'Environment',
      cell: (testbed) => testbed.environment ? (
        <Badge
          variant="outline"
          className={getEnvironmentBadgeColor(testbed.environment)}
        >
          {testbed.environment}
          {testbed.envFlavor && ` (${testbed.envFlavor})`}
        </Badge>
      ) : null
    },
    {
      key: 'status',
      header: 'Status',
      cell: (testbed) => (
        <Badge
          variant="outline"
          className={`
            ${testbed.status === 'active' ? 'text-green-500 border-green-500' : 
              testbed.status === 'provisioning' ? 'text-blue-500 border-blue-500' : 
              testbed.status === 'failed' ? 'text-red-500 border-red-500' : 
              'text-gray-500 border-gray-500'}
          `}
        >
          <span className={`mr-1.5 h-2 w-2 rounded-full inline-block ${
            testbed.status === 'active' ? 'bg-green-500' : 
            testbed.status === 'provisioning' ? 'bg-blue-500' : 
            testbed.status === 'failed' ? 'bg-red-500' : 
            'bg-gray-500'
          }`}></span>
          {testbed.status}
        </Badge>
      )
    },
    {
      key: 'type',
      header: 'Type',
      cell: (testbed) => (
        <Badge
          variant="outline"
          className={`
            ${testbed.type === 'hardware' ? 'text-red-500 border-red-500' : 
              testbed.type === 'virtual' ? 'text-blue-500 border-blue-500' : 
              'text-purple-500 border-purple-500'}
          `}
        >
          {testbed.type}
        </Badge>
      )
    },
    {
      key: 'owner',
      header: 'Owner',
      cell: (testbed) => testbed.ownedBy
    },
    {
      key: 'created',
      header: 'Created',
      cell: (testbed) => new Date(testbed.createdAt).toLocaleDateString()
    },
  ];

  const actionColumn = (testbed: Testbed) => (
    <TestbedActionMenu 
      testbed={testbed} 
      onAction={onTestbedAction} 
      onViewDetails={onViewDetails} 
    />
  );

  return (
    <div className="space-y-6">
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search testbeds..."
      />

      <Separator />

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <DataTable
          data={filteredTestbeds}
          columns={columns}
          keyExtractor={(testbed) => testbed.id}
          isLoading={isLoading}
          emptyTitle="No Testbeds Found"
          emptyDescription="No testbeds have been added yet."
          searchQuery={searchQuery}
          onRowClick={onViewDetails}
          actionColumn={actionColumn}
        />
      )}
    </div>
  );
};
