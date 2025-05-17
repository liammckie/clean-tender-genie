
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { TooltipProvider } from '@/components/ui/tooltip';
import Dashboard from './pages/Dashboard';
import RftTasksDashboard from './pages/RftTasksDashboard';
import IndividualRftTaskView from './pages/IndividualRftTaskView';
import DmsRouter from './pages/DmsRouter';
import AdminDashboard from './pages/AdminDashboard';
import AdminRouter from './pages/AdminRouter';
import Reports from './pages/Reports';
import GoogleDriveTest from './pages/GoogleDriveTest';
import DocumentEditor from './pages/DocumentEditor';
import DmsDocumentDetails from './pages/DmsDocumentDetails';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-spotify-black text-white">
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rfts" element={<RftTasksDashboard />} />
            <Route path="/rfts/:id" element={<IndividualRftTaskView />} />
            <Route path="/dms" element={<DmsRouter />} />
            <Route path="/dms/documents/:id" element={<DmsDocumentDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminRouter />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/google-drive-test" element={<GoogleDriveTest />} />
            <Route path="/document-editor" element={<DocumentEditor />} />
            <Route path="/document-editor/:id" element={<DocumentEditor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
