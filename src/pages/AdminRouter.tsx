
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import Layout from '@/components/layout/Layout';

const AdminRouter = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="*" element={
        <Layout>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white">Admin Page Not Found</h1>
            <p className="text-spotify-lightgray mt-4">The requested admin page could not be found.</p>
          </div>
        </Layout>
      } />
    </Routes>
  );
};

export default AdminRouter;
