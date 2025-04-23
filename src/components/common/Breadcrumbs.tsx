import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter((p) => p);

  if (paths.length === 0) return null;

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="text-sm text-gray-700 hover:text-primary">
            Home
          </Link>
        </li>

        {paths.map((path, index) => {
          const route = `/${paths.slice(0, index + 1).join('/')}`;
          const isLast = index === paths.length - 1;

          // Format the path to be more readable (capitalize and replace hyphens with spaces)
          const formattedPath = path
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return (
            <li key={route} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {isLast ? (
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {formattedPath}
                </span>
              ) : (
                <Link
                  to={route}
                  className="ml-1 text-sm text-gray-700 hover:text-primary md:ml-2"
                >
                  {formattedPath}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
