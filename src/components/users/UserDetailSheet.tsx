
import React from 'react';
import { format, parseISO } from 'date-fns';
import { User } from '@/api/types/users';
import { UserRoleBadge } from './UserRoleBadge';
import { UserStatusBadge } from './UserStatusBadge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { FileEdit, Trash2, Check, XCircle, AtSign, Building, CalendarClock } from 'lucide-react';

interface UserDetailSheetProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User, newStatus: boolean) => void;
}

export const UserDetailSheet: React.FC<UserDetailSheetProps> = ({
  user,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  if (!user) return null;

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'Never';
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return format(date, 'PPpp');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {getInitials(user.cn)}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle>{user.cn}</SheetTitle>
              <SheetDescription className="flex items-center">
                <AtSign className="h-3 w-3 mr-1" />
                {user.email}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            <UserStatusBadge isActive={user.isActive} />
            <div className="flex gap-2">
              {user.roles.map(role => (
                <UserRoleBadge key={role} role={role} />
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Organization</h4>
              <div className="flex items-start">
                <Building className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p>{user.org}</p>
                  <p className="text-sm text-muted-foreground">{user.businessUnit}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Reports To</h4>
              <p>{user.manager || 'No Manager'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Slack</h4>
              <p>{user.slackUsername}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Is Manager</h4>
                <p>{user.isManager ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Sequence</h4>
                <p>{user.sequenceValue}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <CalendarClock className="h-4 w-4 mr-1" />
                Activity
              </h4>
              <div className="space-y-2 mt-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Last Login: </span>
                  {formatDate(user.lastLoggedIn)}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Last Rating: </span>
                  {formatDate(user.lastRatingSubmittedOn)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-col space-y-2 sm:space-y-2 mt-4">
          <div className="flex space-x-2">
            <Button 
              className="flex-1"
              onClick={() => onEdit(user)}
            >
              <FileEdit className="h-4 w-4 mr-2" />
              Edit User
            </Button>
            {user.isActive ? (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onToggleStatus(user, false)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Deactivate
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onToggleStatus(user, true)}
              >
                <Check className="h-4 w-4 mr-2" />
                Activate
              </Button>
            )}
          </div>
          <Button 
            variant="destructive"
            className="w-full" 
            onClick={() => onDelete(user)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
