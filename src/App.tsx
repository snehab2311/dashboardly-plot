
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import EDAGenerator from "./pages/EDAGenerator";
import KPIBuilder from "./pages/KPIBuilder";
import MyDashboards from "./pages/MyDashboards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="eda" element={<EDAGenerator />} />
            <Route path="kpi-builder" element={<KPIBuilder />} />
            <Route path="my-dashboards" element={<MyDashboards />} />
            <Route path="data-sources" element={<Dashboard />} />
            <Route path="analytics" element={<Dashboard />} />
            <Route path="users" element={<Dashboard />} />
            <Route path="settings" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
