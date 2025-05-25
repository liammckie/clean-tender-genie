
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Settings, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [stats] = useState({
    totalUsers: 156,
    activeRFTs: 23,
    completedRFTs: 89,
    systemHealth: 'Good'
  });

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
              <Users className="h-4 w-4 text-spotify-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active RFTs</CardTitle>
              <FileText className="h-4 w-4 text-spotify-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeRFTs}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Completed RFTs</CardTitle>
              <Activity className="h-4 w-4 text-spotify-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.completedRFTs}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">System Health</CardTitle>
              <Settings className="h-4 w-4 text-spotify-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.systemHealth}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader>
              <CardTitle className="text-white">System Settings</CardTitle>
              <CardDescription className="text-spotify-lightgray">
                Manage system configuration and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Access Settings</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription className="text-spotify-lightgray">
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Manage Users</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
