
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <SidebarInset className="p-4">
            <main className="max-w-4xl mx-auto w-full">
              <div className="md:hidden flex items-center mb-4">
                <SidebarTrigger />
                <span className="ml-2 text-sm text-gray-500">Menu</span>
              </div>
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
