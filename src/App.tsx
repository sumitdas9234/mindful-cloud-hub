
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Layout = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-auto p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

// Placeholder component for unimplemented routes
const ComingSoon = ({ feature }: { feature: string }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <h2 className="text-2xl font-bold mb-2">{feature} Management</h2>
    <p className="text-muted-foreground">This feature is coming soon.</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout title="Dashboard">
                <Index />
              </Layout>
            } 
          />
          
          {/* Compute Routes */}
          <Route 
            path="/vcenters" 
            element={
              <Layout title="vCenter Management">
                <ComingSoon feature="vCenter" />
              </Layout>
            } 
          />
          <Route 
            path="/testbeds" 
            element={
              <Layout title="Testbed Management">
                <ComingSoon feature="Testbed" />
              </Layout>
            } 
          />
          <Route 
            path="/kubernetes" 
            element={
              <Layout title="Kubernetes Management">
                <ComingSoon feature="Kubernetes" />
              </Layout>
            } 
          />
          
          {/* Infrastructure Routes */}
          <Route 
            path="/networking" 
            element={
              <Layout title="Network Management">
                <ComingSoon feature="Network" />
              </Layout>
            } 
          />
          <Route 
            path="/storage" 
            element={
              <Layout title="Storage Management">
                <ComingSoon feature="Storage" />
              </Layout>
            } 
          />
          
          {/* Observability Routes */}
          <Route 
            path="/monitoring" 
            element={
              <Layout title="Monitoring">
                <ComingSoon feature="Monitoring" />
              </Layout>
            } 
          />
          <Route 
            path="/alerts" 
            element={
              <Layout title="Alerts">
                <ComingSoon feature="Alert" />
              </Layout>
            } 
          />
          
          {/* Administration Routes */}
          <Route 
            path="/users" 
            element={
              <Layout title="User Management">
                <ComingSoon feature="User" />
              </Layout>
            } 
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
