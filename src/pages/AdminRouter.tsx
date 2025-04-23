import React from 'react';
import Layout from '../components/layout/Layout';
import { Outlet } from 'react-router-dom';
const AdminRouter = () => (
  <Layout>
    <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
    <Outlet />
  </Layout>
);
export default AdminRouter;
