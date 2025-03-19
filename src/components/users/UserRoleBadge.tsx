
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Users, Database, HardDrive, Eye, Settings, Clock } from 'lucide-react';

interface UserRoleBadgeProps {
  role: string;
  size?: 'sm' | 'default';
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role, size = 'default' }) => {
  const getRoleData = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return { 
          icon: <Shield className="h-3 w-3 mr-1" />, 
          label: 'Admin',
          variant: 'destructive' as const
        };
      case 'manager':
        return { 
          icon: <Users className="h-3 w-3 mr-1" />, 
          label: 'Manager',
          variant: 'default' as const
        };
      case 'executive':
        return { 
          icon: <Settings className="h-3 w-3 mr-1" />, 
          label: 'Executive',
          variant: 'default' as const
        };
      case 'hr':
        return { 
          icon: <User className="h-3 w-3 mr-1" />, 
          label: 'HR',
          variant: 'secondary' as const
        };
      case 'operator':
        return { 
          icon: <HardDrive className="h-3 w-3 mr-1" />, 
          label: 'Operator',
          variant: 'outline' as const
        };
      case 'tester':
        return { 
          icon: <Database className="h-3 w-3 mr-1" />, 
          label: 'Tester',
          variant: 'outline' as const
        };
      case 'viewer':
        return { 
          icon: <Eye className="h-3 w-3 mr-1" />, 
          label: 'Viewer',
          variant: 'outline' as const
        };
      default:
        return { 
          icon: <Clock className="h-3 w-3 mr-1" />, 
          label: role,
          variant: 'outline' as const
        };
    }
  };

  const { icon, label, variant } = getRoleData(role);

  return (
    <Badge 
      variant={variant} 
      className={`flex items-center ${size === 'sm' ? 'text-xs py-0 px-2' : ''}`}
    >
      {icon}
      {label}
    </Badge>
  );
};
