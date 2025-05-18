
import React from 'react';
import Layout from '../components/layout/Layout';
import { Outlet, Routes, Route } from 'react-router-dom';

const AdminRouter = () => (
  <Layout>
    <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="*" element={<Outlet />} />
    </Routes>
  </Layout>
);

// Simple placeholder component for the admin dashboard
const AdminDashboard = () => (
  <div className="p-4 bg-spotify-darkgray rounded-md">
    <h3 className="text-xl mb-3">Admin Dashboard</h3>
    <p className="text-spotify-lightgray">Welcome to the admin dashboard. Use the sidebar to navigate to different admin sections.</p>
  </div>
);

export default AdminRouter;
