import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8 text-center">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
