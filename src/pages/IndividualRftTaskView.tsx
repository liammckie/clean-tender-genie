import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
const IndividualRftTaskView = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">RFT Task Detail</h2>
      <p>
        Viewing task with ID: <span className="font-mono">{id}</span>
      </p>
    </Layout>
  );
};
export default IndividualRftTaskView;
