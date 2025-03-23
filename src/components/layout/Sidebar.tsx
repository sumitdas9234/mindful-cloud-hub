import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Server,
  Database,
  HardDrive,
  Users,
  AlertTriangle,
  Cloud,
  Cpu,
  Folder,
  GitBranch,
  Globe,
  Network,
  Activity,
  Layers
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  collapsed: boolean;
  active: boolean;
  indent?: boolean;
  external?: boolean;
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  path, 
  collapsed, 
  active, 
  indent = false,
  external = false 
}: SidebarItemProps) => {
  if (external) {
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-200 group relative h-10",
          "text-foreground/70 hover:bg-secondary hover:text-foreground",
          indent && !collapsed && "pl-8",
          collapsed && "justify-center"
        )}
      >
        <Icon 
          className={cn(
            "flex-shrink-0 transition-all duration-200",
            collapsed ? "w-5 h-5" : "w-5 h-5 mr-3"
          )} 
        />
        <span 
          className={cn(
            "text-sm font-medium transition-all duration-200 whitespace-nowrap overflow-hidden",
            collapsed && "opacity-0 w-0"
          )}
        >
          {label}
        </span>
      </a>
    );
  }

  return (
    <Link
      to={path}
      className={cn(
        "flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-200 group relative h-10",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-foreground/70 hover:bg-secondary hover:text-foreground",
        indent && !collapsed && "pl-8",
        collapsed && "justify-center"
      )}
    >
      <Icon 
        className={cn(
          "flex-shrink-0 transition-all duration-200",
          collapsed ? "w-5 h-5" : "w-5 h-5 mr-3"
        )} 
      />
      <span 
        className={cn(
          "text-sm font-medium transition-all duration-200 whitespace-nowrap overflow-hidden",
          collapsed && "opacity-0 w-0"
        )}
      >
        {label}
      </span>
      {active && (
        <div className={cn(
          "absolute right-0 w-1 h-8 bg-primary rounded-l-full transition-all duration-300",
          collapsed && "w-1.5 h-6"
        )} />
      )}
    </Link>
  );
};

interface SidebarSectionProps {
  title: string;
  collapsed: boolean;
  children: React.ReactNode;
}

const SidebarSection = ({ title, collapsed, children }: SidebarSectionProps) => {
  return (
    <div className="mb-6">
      {!collapsed && (
        <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={cn(
        "h-screen flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out sticky top-0",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-border transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <span className="ml-2 text-lg font-semibold">InfraOps</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1 overflow-y-auto py-4 px-3">
        <SidebarSection title="Overview" collapsed={collapsed}>
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Overview" 
            path="/"
            collapsed={collapsed}
            active={location.pathname === '/'}
          />
        </SidebarSection>
        
        <SidebarSection title="Managed Services" collapsed={collapsed}>
          <SidebarItem 
            icon={Cloud} 
            label="Production Clusters" 
            path="/kubernetes"
            collapsed={collapsed}
            active={location.pathname === '/kubernetes'}
          />
          <SidebarItem 
            icon={Cpu} 
            label="Apps and Services" 
            path="/apps"
            collapsed={collapsed}
            active={location.pathname === '/apps'}
          />
        </SidebarSection>
        
        <SidebarSection title="Infrastructure" collapsed={collapsed}>
          <SidebarItem 
            icon={Server} 
            label="vCenters" 
            path="/vcenters"
            collapsed={collapsed}
            active={location.pathname === '/vcenters'}
          />
          <SidebarItem 
            icon={Folder} 
            label="Testbeds" 
            path="/testbeds"
            collapsed={collapsed}
            active={location.pathname === '/testbeds'}
          />
          <SidebarItem 
            icon={Layers} 
            label="Templates" 
            path="/templates"
            collapsed={collapsed}
            active={location.pathname === '/templates'}
          />
          <SidebarItem 
            icon={Network} 
            label="Clusters" 
            path="/clusters"
            collapsed={collapsed}
            active={location.pathname === '/clusters'}
          />
          <SidebarItem 
            icon={Globe} 
            label="Subnets" 
            path="/networking/subnets"
            collapsed={collapsed}
            active={location.pathname === '/networking/subnets'}
          />
          <SidebarItem 
            icon={GitBranch} 
            label="Routes" 
            path="/networking/routes"
            collapsed={collapsed}
            active={location.pathname === '/networking/routes'}
          />
          <SidebarItem 
            icon={HardDrive} 
            label="Storage" 
            path="/storage"
            collapsed={collapsed}
            active={location.pathname === '/storage'}
          />
        </SidebarSection>
        
        <SidebarSection title="Observability" collapsed={collapsed}>
          <SidebarItem 
            icon={Database} 
            label="Monitoring" 
            path="/monitoring"
            collapsed={collapsed}
            active={location.pathname === '/monitoring'}
          />
          <SidebarItem 
            icon={AlertTriangle} 
            label="Alerts" 
            path="/alerts"
            collapsed={collapsed}
            active={location.pathname === '/alerts'}
          />
        </SidebarSection>
        
        <SidebarSection title="Administration" collapsed={collapsed}>
          <SidebarItem 
            icon={Users} 
            label="Users" 
            path="/users"
            collapsed={collapsed}
            active={location.pathname === '/users'}
          />
          <SidebarItem 
            icon={Activity} 
            label="System Status" 
            path="/system-status"
            collapsed={collapsed}
            active={location.pathname === '/system-status'}
            external={true}
          />
        </SidebarSection>
      </ScrollArea>
      
      {/* Status */}
      <div className={cn(
        "p-4 border-t border-border flex items-center",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className={cn("flex items-center", collapsed && "flex-col")}>
          <div className="w-2 h-2 rounded-full bg-green-500" />
          {!collapsed && (
            <span className="ml-2 text-sm text-muted-foreground">All systems normal</span>
          )}
        </div>
      </div>
    </div>
  );
};
