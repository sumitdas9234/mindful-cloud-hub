
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
  Network,
  Users,
  AlertTriangle,
  Cloud,
  Cpu,
  MemoryStick,
  Folder
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  collapsed: boolean;
  active: boolean;
}

const SidebarItem = ({ icon: Icon, label, path, collapsed, active }: SidebarItemProps) => {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-200 group",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-foreground/70 hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon 
        className={cn(
          "flex-shrink-0 transition-all duration-200",
          collapsed ? "w-6 h-6" : "w-5 h-5 mr-3"
        )} 
      />
      <span 
        className={cn(
          "text-sm font-medium transition-all duration-200",
          collapsed && "opacity-0 w-0 overflow-hidden"
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
        "h-screen flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out relative",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-border transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Server className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && (
            <span className="ml-2 text-lg font-semibold">InfraOps</span>
          )}
        </div>
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
      <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-none">
        <SidebarSection title="Overview" collapsed={collapsed}>
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            path="/"
            collapsed={collapsed}
            active={location.pathname === '/'}
          />
        </SidebarSection>
        
        <SidebarSection title="Compute" collapsed={collapsed}>
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
            icon={Cloud} 
            label="Kubernetes" 
            path="/kubernetes"
            collapsed={collapsed}
            active={location.pathname === '/kubernetes'}
          />
        </SidebarSection>
        
        <SidebarSection title="Infrastructure" collapsed={collapsed}>
          <SidebarItem 
            icon={Network} 
            label="Networking" 
            path="/networking"
            collapsed={collapsed}
            active={location.pathname === '/networking'}
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
            icon={Cpu} 
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
        </SidebarSection>
      </div>
      
      {/* Status */}
      <div className={cn(
        "p-4 border-t border-border flex items-center justify-center",
        collapsed ? "flex-col" : "justify-between"
      )}>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          {!collapsed && (
            <span className="ml-2 text-sm text-muted-foreground">All systems normal</span>
          )}
        </div>
      </div>
    </div>
  );
};
