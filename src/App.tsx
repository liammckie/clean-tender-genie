
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import APIFeatures from './pages/APIFeatures';
import AgentsSDK from './pages/AgentsSDK';
import NotFound from './pages/NotFound';
import { TooltipProvider } from '@/components/ui/tooltip';
import Dashboard from './pages/Dashboard';
import RftTasksDashboard from './pages/RftTasksDashboard';
import IndividualRftTaskView from './pages/IndividualRftTaskView';
import DmsRouter from './pages/DmsRouter';
import AdminRouter from './pages/AdminRouter';
import Reports from './pages/Reports';
import GoogleDriveTest from './pages/GoogleDriveTest';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <div className="flex min-h-screen flex-col">
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rfts" element={<RftTasksDashboard />} />
            <Route path="/rfts/:id" element={<IndividualRftTaskView />} />
            <Route path="/dms/*" element={<DmsRouter />} />
            <Route path="/admin/*" element={<AdminRouter />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/google-drive-test" element={<GoogleDriveTest />} />
            <Route path="/api-features" element={<APIFeatures />} />
            <Route path="/agents-sdk" element={<AgentsSDK />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
