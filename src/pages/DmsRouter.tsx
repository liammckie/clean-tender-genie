
import React from 'react';
import Layout from '../components/layout/Layout';
import { Outlet } from 'react-router-dom';
import DmsHome from './DmsHome';
import { useLocation } from 'react-router-dom';

const DmsRouter = () => {
  const location = useLocation();
  const isDmsRoot = location.pathname === '/dms' || location.pathname === '/dms/';

  return (
    <Layout>
      {isDmsRoot ? <DmsHome /> : <Outlet />}
    </Layout>
  );
};

export default DmsRouter;
