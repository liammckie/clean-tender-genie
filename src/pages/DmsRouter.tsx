
import { Outlet } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const DmsRouter = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default DmsRouter;
