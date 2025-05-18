
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { FileX } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-spotify-darkgray p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <FileX className="h-16 w-16 mx-auto mb-4 text-spotify-green" />
          <h1 className="text-3xl font-bold mb-2 text-white">404 - Page Not Found</h1>
          <p className="text-spotify-lightgray mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <Link to="/">
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
