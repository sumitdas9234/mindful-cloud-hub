import React from 'react';
import { TemplateOS, Kernel, VCenterAvailability } from '@/api/types/templates';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Server, Tag, Check, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TemplateDetailSheetProps {
  template: TemplateOS | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateDetailSheet: React.FC<TemplateDetailSheetProps> = ({ 
  template, 
  isOpen, 
  onClose 
}) => {
  const handleDeployTemplate = (version: string, kernel: string) => {
    toast({
      title: "Deployment initiated",
      description: `${template?.name} ${version} with kernel ${kernel} is being deployed.`,
    });
  };
  
  if (!template) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl w-full p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="text-left">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                  {template.icon ? (
                    <i className={`${template.icon} h-8 w-8 flex items-center justify-center`}></i>
                  ) : (
                    <div className="h-8 w-8 bg-primary/10 flex items-center justify-center rounded">
                      <span className="text-sm font-medium text-primary">{template.name.substring(0, 2)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <SheetTitle className="flex items-center gap-2">
                    {template.name}
                    {template.isPopular && (
                      <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                        Popular
                      </Badge>
                    )}
                  </SheetTitle>
                  <SheetDescription>
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)} distribution template
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
            
            <div className="my-6">
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>
            
            <Tabs defaultValue="versions">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="versions">Versions</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="vcenters">vCenters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="versions" className="pt-4 space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  {template.versions.map((version) => (
                    <AccordionItem value={version.version} key={version.version}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <span>{version.version}</span>
                          {version.isLatest && (
                            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-xs">
                              Latest
                            </Badge>
                          )}
                          {version.isRecommended && (
                            <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800">
                              Recommended
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2 pb-1">
                          {version.description && (
                            <div className="text-sm text-muted-foreground">{version.description}</div>
                          )}
                          {version.releaseDate && (
                            <div className="text-sm">
                              <span className="font-medium">Release date:</span>{' '}
                              {new Date(version.releaseDate).toLocaleDateString()}
                            </div>
                          )}
                          
                          <Separator className="my-3" />
                          
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium">Available kernels</h4>
                            <div className="grid grid-cols-1 gap-3">
                              {version.kernels.map((kernel) => (
                                <KernelCard 
                                  key={kernel.version}
                                  kernel={kernel}
                                  version={version.version}
                                  onDeploy={() => handleDeployTemplate(version.version, kernel.version)}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              
              <TabsContent value="availability" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">vCenter Availability</CardTitle>
                    <CardDescription>
                      This template is available on all vCenters in the infrastructure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Available on all vCenters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Compatible with all clusters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Standard resource requirements</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="vcenters" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">vCenter Status</CardTitle>
                    <CardDescription>
                      Check which vCenters have this template available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {template.vCenterAvailability ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>vCenter Name</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {template.vCenterAvailability.map((vcenter) => (
                            <TableRow key={vcenter.id}>
                              <TableCell className="font-medium">{vcenter.name}</TableCell>
                              <TableCell className="text-right">
                                {vcenter.isAvailable ? (
                                  <div className="flex items-center justify-end gap-1 text-green-600">
                                    <Check className="h-4 w-4" />
                                    <span>Available</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-1 text-red-600">
                                    <X className="h-4 w-4" />
                                    <span>Missing</span>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No vCenter availability information available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

interface KernelCardProps {
  kernel: Kernel;
  version: string;
  onDeploy: () => void;
}

const KernelCard: React.FC<KernelCardProps> = ({ kernel, version, onDeploy }) => {
  return (
    <div className="border rounded-md p-3 bg-card">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{kernel.version}</span>
            {kernel.isLatest && (
              <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-xs">
                Latest
              </Badge>
            )}
          </div>
          {kernel.description && (
            <div className="text-sm text-muted-foreground mt-1">{kernel.description}</div>
          )}
        </div>
        <Button size="sm" onClick={onDeploy}>
          <Download className="h-4 w-4 mr-2" />
          Deploy
        </Button>
      </div>
    </div>
  );
};
