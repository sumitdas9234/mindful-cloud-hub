
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface ConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testbedName: string;
  kubeCtlCommand: string;
  copiedCommand: boolean;
  handleCopyCommand: () => void;
}

export const ConnectDialog: React.FC<ConnectDialogProps> = ({
  open,
  onOpenChange,
  testbedName,
  kubeCtlCommand,
  copiedCommand,
  handleCopyCommand
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[70%]">
        <DialogHeader>
          <DialogTitle>Connect to {testbedName}</DialogTitle>
          <DialogDescription>
            Use the following kubectl command to connect to this testbed
          </DialogDescription>
        </DialogHeader>
        <div className="bg-secondary rounded-md p-4 mt-4 overflow-x-auto">
          <div className="flex justify-between items-start">
            <pre className="text-sm font-mono whitespace-pre overflow-x-auto max-w-full break-all">
              {kubeCtlCommand}
            </pre>
            <Button variant="ghost" size="icon" onClick={handleCopyCommand} className="ml-2 self-start flex-shrink-0">
              {copiedCommand ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
