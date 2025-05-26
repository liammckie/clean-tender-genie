
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, FileText, Clock, CheckCircle } from 'lucide-react';
import { rftTaskService, RftTask } from '@/services/rftTaskService';

const Dashboard = () => {
  const [tasks, setTasks] = useState<RftTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const taskList = await rftTaskService.listTasks();
        setTasks(taskList);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const dashboardData = {
    activeRFTs: tasks.filter(task => task.status === 'processing').length,
    completedThisMonth: tasks.filter(task => {
      const createdDate = new Date(task.createdAt);
      const now = new Date();
      return task.status === 'completed' && 
             createdDate.getMonth() === now.getMonth() && 
             createdDate.getFullYear() === now.getFullYear();
    }).length,
    pendingReview: tasks.filter(task => task.status === 'pending').length,
    averageTime: '2.5 days' // This would be calculated from actual data in a real implementation
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
          <div className="text-white">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active RFTs</CardTitle>
              <FileText className="h-4 w-4 text-spotify-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData.activeRFTs}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Completed This Month</CardTitle>
              <CheckCircle className="h-4 w-4 text-spotify-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData.completedThisMonth}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-spotify-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData.pendingReview}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Avg. Processing Time</CardTitle>
              <Activity className="h-4 w-4 text-spotify-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData.averageTime}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
