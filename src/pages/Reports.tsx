
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [reportData] = useState([
    { month: 'Jan', completed: 12, inProgress: 5 },
    { month: 'Feb', completed: 15, inProgress: 8 },
    { month: 'Mar', completed: 18, inProgress: 12 },
    { month: 'Apr', completed: 22, inProgress: 15 },
    { month: 'May', completed: 25, inProgress: 18 },
    { month: 'Jun', completed: 28, inProgress: 20 }
  ]);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Reports & Analytics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader>
              <CardTitle className="text-white">RFT Performance</CardTitle>
              <CardDescription className="text-spotify-lightgray">
                Monthly completion and progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#b3b3b3" />
                    <YAxis stroke="#b3b3b3" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#191414', 
                        border: '1px solid #333',
                        borderRadius: '4px'
                      }}
                    />
                    <Bar dataKey="completed" fill="#1db954" />
                    <Bar dataKey="inProgress" fill="#535353" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader>
              <CardTitle className="text-white">Key Metrics</CardTitle>
              <CardDescription className="text-spotify-lightgray">
                Important performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-spotify-black rounded-md">
                <span className="text-spotify-lightgray">Success Rate</span>
                <span className="text-white font-semibold">85%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-spotify-black rounded-md">
                <span className="text-spotify-lightgray">Avg. Response Time</span>
                <span className="text-white font-semibold">2.3 days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-spotify-black rounded-md">
                <span className="text-spotify-lightgray">Client Satisfaction</span>
                <span className="text-white font-semibold">4.7/5</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-spotify-black rounded-md">
                <span className="text-spotify-lightgray">Cost Savings</span>
                <span className="text-white font-semibold">$45,000</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
