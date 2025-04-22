
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ThemeSwitcher from '../common/ThemeSwitcher';

const Navbar = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary dark:text-primary">OpenAI Knowledge Base</h1>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/rfts" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              RFT Tasks
            </Link>
            <Link 
              to="/dms" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              DMS
            </Link>
            <Link 
              to="/reports" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Reports
            </Link>
            <Link 
              to="/admin" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <div className="md:hidden">
              <button className="bg-white dark:bg-gray-800 p-2 rounded-md text-gray-700 dark:text-gray-300">
                <ChevronDown />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
