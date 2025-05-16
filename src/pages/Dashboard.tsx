
import React from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FolderOpen, BarChart3, Users } from 'lucide-react';

const Dashboard = () => {
  // Mock data for dashboard
  const stats = [
    { title: 'Active RFTs', value: '12', icon: <FileText className="h-8 w-8 text-spotify-green" /> },
    { title: 'Documents', value: '48', icon: <FolderOpen className="h-8 w-8 text-spotify-green" /> },
    { title: 'Success Rate', value: '92%', icon: <BarChart3 className="h-8 w-8 text-spotify-green" /> },
    { title: 'Team Members', value: '5', icon: <Users className="h-8 w-8 text-spotify-green" /> },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-spotify-darkgray border-none hover:bg-[#282828] transition-all duration-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-spotify-lightgray mb-1">{stat.title}</p>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-[#1e1e1e]">
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="bg-spotify-darkgray border-none">
            <CardHeader>
              <CardTitle className="text-white">Recent RFTs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-spotify-lightgray">No recent RFTs found.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-none">
            <CardHeader>
              <CardTitle className="text-white">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-spotify-lightgray">No recent activities found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
