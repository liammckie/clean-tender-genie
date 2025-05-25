
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Clock, TrendingUp } from 'lucide-react';

const Home = () => {
  const [recentActivity] = useState([
    { id: 1, title: 'RFT Response - Commercial Cleaning', status: 'In Progress', date: '2024-01-15' },
    { id: 2, title: 'Office Building Maintenance RFT', status: 'Completed', date: '2024-01-14' },
    { id: 3, title: 'Hospital Cleaning Services', status: 'Draft', date: '2024-01-13' }
  ]);

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to RFT Assistant</h1>
          <p className="text-spotify-lightgray">Streamline your tender response process with AI-powered assistance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Plus className="h-5 w-5 mr-2 text-spotify-green" />
                New RFT Response
              </CardTitle>
              <CardDescription className="text-spotify-lightgray">
                Start a new tender response with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>

          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="h-5 w-5 mr-2 text-spotify-green" />
                Document Library
              </CardTitle>
              <CardDescription className="text-spotify-lightgray">
                Access your document management system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Browse Documents</Button>
            </CardContent>
          </Card>

          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <TrendingUp className="h-5 w-5 mr-2 text-spotify-green" />
                Analytics
              </CardTitle>
              <CardDescription className="text-spotify-lightgray">
                View your tender response performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View Reports</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-spotify-darkgray border-spotify-gray">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-spotify-lightgray">
              Your latest tender responses and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-spotify-black rounded-md">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-spotify-lightgray mr-3" />
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-spotify-lightgray text-sm">{item.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    item.status === 'Completed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : item.status === 'In Progress'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Home;
