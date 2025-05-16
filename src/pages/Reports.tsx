
import React from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, BarChart3, PieChart, LineChart } from 'lucide-react';

const Reports = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <p className="text-spotify-lightgray">View analytics and reports about your RFT responses.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="bg-spotify-darkgray border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-spotify-green" />
                RFT Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[300px] flex items-center justify-center">
              <div className="text-center text-spotify-lightgray">
                <BarChart className="h-16 w-16 mx-auto text-spotify-gray mb-4" />
                <p>Chart data will appear here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-spotify-green" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[300px] flex items-center justify-center">
              <div className="text-center text-spotify-lightgray">
                <PieChart className="h-16 w-16 mx-auto text-spotify-gray mb-4" />
                <p>Chart data will appear here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-none col-span-1 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center">
                <LineChart className="mr-2 h-5 w-5 text-spotify-green" />
                Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[300px] flex items-center justify-center">
              <div className="text-center text-spotify-lightgray">
                <LineChart className="h-16 w-16 mx-auto text-spotify-gray mb-4" />
                <p>Chart data will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
