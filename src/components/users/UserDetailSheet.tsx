
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
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { FileEdit, Check, XCircle, AtSign, Building, CalendarClock, Users } from 'lucide-react';

interface UserDetailSheetProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User, newStatus: boolean) => void;
}

export const UserDetailSheet: React.FC<UserDetailSheetProps> = ({
  user,
  open,
  onOpenChange,
  onEdit,
  onToggleStatus
}) => {
  if (!user) return null;

  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return 'Never';
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return format(date, 'PPpp');
    } catch (error) {
      return 'Never';
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
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {getInitials(user.cn)}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-xl">{user.cn}</SheetTitle>
              <SheetDescription className="flex items-center mt-1">
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
              {(user.roles || ['user']).map(role => (
                <UserRoleBadge key={role} role={role} />
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Card className="bg-muted/20 border-none shadow-sm">
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium mb-1">Organization</h4>
                      <p className="text-sm">{user.org}</p>
                      <p className="text-xs text-muted-foreground mt-1">{user.businessUnit}</p>
                    </div>
                  </div>
                
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium mb-1">Reports To</h4>
                      <p className="text-sm">{user.manager || 'No Manager'}</p>
                    </div>
                  </div>
                
                  {user.slackUsername && (
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 h-5 w-5 flex items-center justify-center text-primary mt-0.5 font-bold text-lg">
                        #
                      </span>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Slack</h4>
                        <p className="text-sm">{user.slackUsername}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/20 border-none shadow-sm">
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Is Manager</h4>
                    <p className="text-sm">{user.isManager ? 'Yes' : 'No'}</p>
                  </div>
                  {user.sequenceValue !== undefined && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Sequence</h4>
                      <p className="text-sm">{user.sequenceValue}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/20 border-none shadow-sm">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <CalendarClock className="h-5 w-5 text-primary mt-0.5" />
                  <div className="w-full">
                    <h4 className="text-sm font-medium mb-2">Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Login:</span>
                        <span>{formatDate(user.lastLoggedIn)}</span>
                      </div>
                      {user.lastRatingSubmittedOn && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Rating:</span>
                          <span>{formatDate(user.lastRatingSubmittedOn)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <SheetFooter className="pt-4">
          <div className="flex space-x-2 w-full">
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
