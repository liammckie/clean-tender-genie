
import React from 'react';
import Layout from '../components/layout/Layout';

const Home = () => {
  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-6">
          RFT Response Generation Assistant
        </h1>

        <p className="text-lg mb-8">
          Welcome to the RFT Response Generation Assistant Dashboard. This application helps you manage and generate responses for Request for Tender documents.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">RFT Dashboard</h2>
            <p className="text-gray-600 mb-4">
              View and manage all your Request for Tender tasks.
            </p>
            <a href="/rfts" className="text-primary hover:underline font-medium">
              Go to Dashboard →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Document Management</h2>
            <p className="text-gray-600 mb-4">
              Access and organize your controlled documents.
            </p>
            <a href="/dms" className="text-primary hover:underline font-medium">
              Open DMS →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Reports</h2>
            <p className="text-gray-600 mb-4">
              View analytics and reports about your RFT responses.
            </p>
            <a href="/reports" className="text-primary hover:underline font-medium">
              View Reports →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Admin Panel</h2>
            <p className="text-gray-600 mb-4">
              Manage system settings and user permissions.
            </p>
            <a href="/admin" className="text-primary hover:underline font-medium">
              Open Admin Panel →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
