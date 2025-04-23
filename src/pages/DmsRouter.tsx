import React from 'react';
import Layout from '../components/layout/Layout';
import { Outlet } from 'react-router-dom';
const DmsRouter = () => (
  <Layout>
    <h2 className="text-2xl font-bold mb-4">DMS Section</h2>
    <Outlet />
  </Layout>
);
export default DmsRouter;
