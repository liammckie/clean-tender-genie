
import React from 'react';
import Layout from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { FileText, FolderOpen, BarChart3, PlusSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: 'Document Editor',
      description: 'Create and edit documents with AI assistance.',
      icon: <PlusSquare size={24} className="text-spotify-green" />,
      path: '/document-editor',
    },
    {
      title: 'RFT Dashboard',
      description: 'Manage all your Request for Tender tasks.',
      icon: <FileText size={24} className="text-spotify-green" />,
      path: '/rfts',
    },
    {
      title: 'Document Management',
      description: 'Access and organize your controlled documents.',
      icon: <FolderOpen size={24} className="text-spotify-green" />,
      path: '/dms',
    },
    {
      title: 'Reports',
      description: 'View analytics about your RFT responses.',
      icon: <BarChart3 size={24} className="text-spotify-green" />,
      path: '/reports',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">
            RFT Response Generation Assistant
          </h1>
          <p className="text-spotify-lightgray text-xl max-w-3xl">
            Generate professional responses for Request for Tender documents with AI assistance.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {features.map((feature) => (
            <Card 
              key={feature.title} 
              className="bg-spotify-darkgray border-none hover:bg-[#282828] transition-all duration-300 cursor-pointer"
              onClick={() => navigate(feature.path)}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h2 className="text-xl font-semibold text-white ml-3">
                    {feature.title}
                  </h2>
                </div>
                <p className="text-spotify-lightgray mb-6">
                  {feature.description}
                </p>
                <div className="mt-auto">
                  <Button 
                    className="bg-spotify-black hover:bg-[#1c1c1c] text-white border border-[#333333]"
                    onClick={() => navigate(feature.path)}
                  >
                    Open {feature.title}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
          <Card className="bg-spotify-darkgray border-none">
            <CardContent className="p-6">
              <p className="text-spotify-lightgray">No recent activities found. Start by creating a new document or RFT task.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
