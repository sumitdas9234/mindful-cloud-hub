
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Info, AlertTriangle, Bell, SeparatorVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
      console.log('Login attempt with:', { email, password });
    }, 1500);
  };

  // Sample announcements - in a real app these would come from an API
  const announcements = [
    {
      type: 'maintenance',
      title: 'Scheduled Maintenance',
      date: 'May 5, 2025',
      description: 'System will be unavailable from 2:00 AM to 4:00 AM EST for scheduled maintenance.',
      icon: AlertTriangle
    },
    {
      type: 'new-feature',
      title: 'New Feature: Kubernetes Monitoring',
      date: 'April 28, 2025',
      description: 'Enhanced Kubernetes cluster monitoring now available with real-time metrics.',
      icon: Bell
    },
    {
      type: 'announcement',
      title: 'Updated Security Guidelines',
      date: 'April 25, 2025',
      description: 'Please review the updated security guidelines for accessing production environments.',
      icon: Info
    }
  ];

  return (
    <div className="flex flex-col md:flex-row h-full min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-bold text-primary/5 pointer-events-none select-none">
          PX
        </div>
      </div>
      
      {/* Announcements Section (Left) */}
      <div className="w-full md:w-1/2 p-6 z-10 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-primary">Management Portal</h1>
          <p className="text-muted-foreground">Platform announcements and updates</p>
        </div>
        
        <div className="space-y-4 overflow-auto max-h-[70vh]">
          {announcements.map((announcement, index) => (
            <Card key={index} className="glass-card backdrop-blur-sm bg-white/5 border border-white/10 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full 
                      ${announcement.type === 'maintenance' ? 'bg-destructive/10 text-destructive' : 
                        announcement.type === 'new-feature' ? 'bg-primary/10 text-primary' : 
                        'bg-muted/80 text-foreground'}`}>
                      <announcement.icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  </div>
                  <span className="text-xs text-muted-foreground">{announcement.date}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm text-muted-foreground">{announcement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-auto pt-6">
          <div className="bg-card/30 backdrop-blur-sm rounded-lg p-5 border border-muted/20">
            <h3 className="text-lg font-semibold mb-3 text-primary">Resources</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button variant="outline" size="sm" className="glass-effect hover:bg-white/20 hover:text-primary transition-all">
                Documentation
              </Button>
              <Button variant="outline" size="sm" className="glass-effect hover:bg-white/20 hover:text-primary transition-all">
                Support
              </Button>
              <Button variant="outline" size="sm" className="glass-effect hover:bg-white/20 hover:text-primary transition-all">
                System Status
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vertical Divider */}
      <div className="hidden md:flex items-center justify-center">
        <Separator orientation="vertical" className="h-5/6 bg-border/50" />
      </div>
      
      {/* Login Form Section (Right) */}
      <div className="w-full md:w-1/2 z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="glass-card backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <a href="#" className="text-primary hover:underline">
                  Sign up
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-muted-foreground absolute bottom-2 left-0 right-0">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
