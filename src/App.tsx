
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VCenters from "./pages/compute/VCenters";
import Testbeds from "./pages/compute/Testbeds";
import Kubernetes from "./pages/compute/Kubernetes";
import AppsAndServices from "./pages/compute/AppsAndServices";
import Networking from "./pages/infrastructure/Networking";
import Subnets from "./pages/infrastructure/Subnets";
import RoutesPage from "./pages/infrastructure/Routes";
import ClustersPage from "./pages/infrastructure/Clusters";
import StorageManagement from "./pages/infrastructure/StorageManagement";

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
          
          <Route 
            path="/kubernetes" 
            element={
              <Layout title="Kubernetes Management">
                <Kubernetes />
              </Layout>
            } 
          />
          <Route 
            path="/apps" 
            element={
              <Layout title="Apps and Services">
                <AppsAndServices />
              </Layout>
            } 
          />
          
          <Route 
            path="/vcenters" 
            element={
              <Layout title="vCenter Management">
                <VCenters />
              </Layout>
            } 
          />
          <Route 
            path="/testbeds" 
            element={
              <Layout title="Testbed Management">
                <Testbeds />
              </Layout>
            } 
          />
          <Route 
            path="/clusters" 
            element={
              <Layout title="Cluster Management">
                <ClustersPage />
              </Layout>
            } 
          />
          <Route 
            path="/networking" 
            element={
              <Layout title="Network Overview">
                <Networking />
              </Layout>
            } 
          />
          <Route 
            path="/networking/subnets" 
            element={
              <Layout title="Subnet Management">
                <Subnets />
              </Layout>
            } 
          />
          <Route 
            path="/networking/routes" 
            element={
              <Layout title="Route Management">
                <RoutesPage />
              </Layout>
            } 
          />
          <Route 
            path="/storage" 
            element={
              <Layout title="Storage Management">
                <StorageManagement />
              </Layout>
            } 
          />
          
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
          
          <Route 
            path="/users" 
            element={
              <Layout title="User Management">
                <ComingSoon feature="User" />
              </Layout>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
