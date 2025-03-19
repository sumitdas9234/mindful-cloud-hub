
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@/api/types/users';

// Define a schema that ensures all required fields are provided
const userFormSchema = z.object({
  _id: z.string().min(3, "Username must be at least 3 characters"),
  cn: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email format"),
  manager: z.string().optional().default("none"), // Changed default to "none" instead of empty string
  org: z.string().min(1, "Organization is required"),
  slackUsername: z.string().startsWith('@', "Slack username must start with @"),
  isManager: z.boolean().default(false),
  roles: z.array(z.string()).min(1, "At least one role is required"),
  isActive: z.boolean().default(true),
  businessUnit: z.string().min(1, "Business unit is required"),
  sequenceValue: z.number().int().positive()
});

// Use the schema to define the form values type
type UserFormValues = z.infer<typeof userFormSchema>;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (user: Omit<User, 'lastLoggedIn' | 'lastRatingSubmittedOn'>) => void;
  availableRoles: string[];
  availableOrgs: string[];
  availableBusinessUnits: string[];
  availableManagers: string[];
  isSubmitting: boolean;
}

export const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  availableRoles,
  availableOrgs,
  availableBusinessUnits,
  availableManagers,
  isSubmitting
}) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      _id: '',
      cn: '',
      email: '',
      manager: 'none', // Changed default to "none" instead of empty string
      org: '',
      slackUsername: '@',
      isManager: false,
      roles: ['viewer'],
      isActive: true,
      businessUnit: '',
      sequenceValue: 100
    }
  });

  const handleSubmit = (values: UserFormValues) => {
    // Process the manager field to convert "none" to empty string if needed
    const processedValues = {
      ...values,
      manager: values.manager === 'none' ? '' : values.manager
    };
    
    // The form validation ensures all required fields are present
    // Explicitly cast to the required type to satisfy TypeScript
    onSubmit(processedValues as Omit<User, 'lastLoggedIn' | 'lastRatingSubmittedOn'>);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. All fields are required unless marked optional.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="jsmith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.smith@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="org"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableOrgs.map(org => (
                          <SelectItem key={org} value={org}>{org}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Unit</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableBusinessUnits.map(bu => (
                          <SelectItem key={bu} value={bu}>{bu}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager (Optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Manager</SelectItem>
                      {availableManagers.map(manager => (
                        <SelectItem key={manager} value={manager}>{manager}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="slackUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slack Username</FormLabel>
                  <FormControl>
                    <Input placeholder="@jsmith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableRoles.map(role => (
                      <FormField
                        key={role}
                        control={form.control}
                        name="roles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, role])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== role
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {role}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sequenceValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sequence Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="isManager"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-8">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Is a Manager
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Active User
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
