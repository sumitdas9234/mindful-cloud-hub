
import React, { useState } from 'react';
import { HardDrive, Database, Zap, Plus, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/compute/PageHeader';
import { DatastoresTable } from '@/components/storage/DatastoresTable';
import { FlashBladesTable } from '@/components/storage/FlashBladesTable';
import { FlashArraysTable } from '@/components/storage/FlashArraysTable';
import { DatastoreDetailSheet } from '@/components/storage/DatastoreDetailSheet';
import { FlashBladeDetailSheet } from '@/components/storage/FlashBladeDetailSheet';
import { FlashArrayDetailSheet } from '@/components/storage/FlashArrayDetailSheet';
import { mockDatastores, mockFlashBlades, mockFlashArrays } from '@/api/mockData/storageData';
import { Datastore, FlashBlade, FlashArray } from '@/api/types/storage';

const StorageManagement = () => {
  const [activeTab, setActiveTab] = useState('datastores');
  const [selectedDatastore, setSelectedDatastore] = useState<Datastore | null>(null);
  const [selectedFlashBlade, setSelectedFlashBlade] = useState<FlashBlade | null>(null);
  const [selectedFlashArray, setSelectedFlashArray] = useState<FlashArray | null>(null);
  const [datastoreSheetOpen, setDatastoreSheetOpen] = useState(false);
  const [flashBladeSheetOpen, setFlashBladeSheetOpen] = useState(false);
  const [flashArraySheetOpen, setFlashArraySheetOpen] = useState(false);

  const handleRefresh = () => {
    // In a real app, this would fetch updated data
    console.log('Refreshing storage data...');
  };

  const handleAddStorage = () => {
    // In a real app, this would open a dialog to add new storage
    console.log('Opening add storage dialog...');
  };

  const handleDatastoreClick = (datastore: Datastore) => {
    setSelectedDatastore(datastore);
    setDatastoreSheetOpen(true);
  };

  const handleFlashBladeClick = (flashBlade: FlashBlade) => {
    setSelectedFlashBlade(flashBlade);
    setFlashBladeSheetOpen(true);
  };

  const handleFlashArrayClick = (flashArray: FlashArray) => {
    setSelectedFlashArray(flashArray);
    setFlashArraySheetOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Storage Management"
        description="Manage storage resources across your infrastructure"
        onRefresh={handleRefresh}
        onAdd={handleAddStorage}
        addButtonText="Add Storage"
      />

      <Tabs defaultValue="datastores" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="datastores" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Datastores</span>
          </TabsTrigger>
          <TabsTrigger value="flashblades" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>FlashBlades</span>
          </TabsTrigger>
          <TabsTrigger value="flasharrays" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            <span>FlashArrays</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="datastores" className="mt-6">
          <DatastoresTable 
            datastores={mockDatastores} 
            onRowClick={handleDatastoreClick}
          />
        </TabsContent>

        <TabsContent value="flashblades" className="mt-6">
          <FlashBladesTable 
            flashBlades={mockFlashBlades} 
            onRowClick={handleFlashBladeClick}
          />
        </TabsContent>

        <TabsContent value="flasharrays" className="mt-6">
          <FlashArraysTable 
            flashArrays={mockFlashArrays} 
            onRowClick={handleFlashArrayClick}
          />
        </TabsContent>
      </Tabs>

      <DatastoreDetailSheet
        datastore={selectedDatastore}
        open={datastoreSheetOpen}
        onOpenChange={setDatastoreSheetOpen}
      />

      <FlashBladeDetailSheet
        flashBlade={selectedFlashBlade}
        open={flashBladeSheetOpen}
        onOpenChange={setFlashBladeSheetOpen}
      />

      <FlashArrayDetailSheet
        flashArray={selectedFlashArray}
        open={flashArraySheetOpen}
        onOpenChange={setFlashArraySheetOpen}
      />
    </div>
  );
};

export default StorageManagement;
