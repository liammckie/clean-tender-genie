
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Settings, FileText, Database, Shield, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminSections = [
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: <Users className="h-8 w-8 text-spotify-green" />,
      path: '/admin/users'
    },
    {
      title: 'System Settings',
      description: 'Configure application settings',
      icon: <Settings className="h-8 w-8 text-spotify-green" />,
      path: '/admin/settings'
    },
    {
      title: 'Document Templates',
      description: 'Manage document templates',
      icon: <FileText className="h-8 w-8 text-spotify-green" />,
      path: '/admin/templates'
    },
    {
      title: 'Database Management',
      description: 'Configure and manage database',
      icon: <Database className="h-8 w-8 text-spotify-green" />,
      path: '/admin/database'
    },
    {
      title: 'Security Settings',
      description: 'Configure security settings',
      icon: <Shield className="h-8 w-8 text-spotify-green" />,
      path: '/admin/security'
    },
    {
      title: 'Notifications',
      description: 'Configure system notifications',
      icon: <Bell className="h-8 w-8 text-spotify-green" />,
      path: '/admin/notifications'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-spotify-lightgray max-w-3xl">
          Manage all aspects of the RFT Response Assistant system from this central dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {adminSections.map((section) => (
            <Card 
              key={section.title} 
              className="bg-spotify-darkgray border-none hover:bg-[#282828] transition-all duration-300 cursor-pointer"
              onClick={() => navigate(section.path)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="p-3 rounded-full bg-[#1e1e1e] mb-4">
                    {section.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">{section.title}</CardTitle>
                  <p className="text-spotify-lightgray">{section.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-spotify-darkgray border-none mt-8">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#1e1e1e] rounded-lg">
                <p className="text-spotify-lightgray">Server Status</p>
                <p className="text-white font-semibold flex items-center mt-1">
                  <span className="h-2 w-2 rounded-full bg-spotify-green mr-2"></span>
                  Online
                </p>
              </div>
              <div className="p-4 bg-[#1e1e1e] rounded-lg">
                <p className="text-spotify-lightgray">Storage Usage</p>
                <p className="text-white font-semibold mt-1">68%</p>
              </div>
              <div className="p-4 bg-[#1e1e1e] rounded-lg">
                <p className="text-spotify-lightgray">Active Users</p>
                <p className="text-white font-semibold mt-1">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
