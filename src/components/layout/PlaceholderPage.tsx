
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tabs?: Array<{ id: string, label: string, content: React.ReactNode }>;
  actionLabel?: string;
  onAction?: () => void;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  icon,
  tabs,
  actionLabel = "Add New",
  onAction = () => console.log("Action clicked")
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            {icon}
            {title}
          </h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button onClick={onAction} className="gap-1">
          <PlusCircle className="h-4 w-4" />
          {actionLabel}
        </Button>
      </div>

      <div className="grid gap-6">
        {tabs ? (
          <Tabs defaultValue={tabs[0].id}>
            <TabsList className="mb-4">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No data available</CardTitle>
              <CardDescription>
                This feature is currently in development. Check back later.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Content will be available soon</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
