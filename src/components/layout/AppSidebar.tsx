
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, FolderOpen, BarChart3, Settings, PlusSquare, Search, Cloud } from 'lucide-react';
import ThemeSwitcher from '../common/ThemeSwitcher';
import { cn } from '@/lib/utils';

const AppSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'RFT Tasks', path: '/rfts', icon: <FileText size={20} /> },
    { name: 'Document Editor', path: '/document-editor', icon: <PlusSquare size={20} /> },
    { name: 'DMS', path: '/dms', icon: <FolderOpen size={20} /> },
    { name: 'Google Drive', path: '/google-drive', icon: <Cloud size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
    { name: 'Admin', path: '/admin', icon: <Settings size={20} /> },
  ];

  return (
    <aside className={cn(
      "min-h-screen bg-spotify-black text-white flex flex-col",
      collapsed ? "w-20" : "w-64",
      "transition-width duration-300 ease-in-out"
    )}>
      {/* Logo area */}
      <div className="p-6 flex justify-between items-center">
        {!collapsed && (
          <span className="text-xl font-bold">RFT Assistant</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-spotify-darkgray"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Search (visual only) */}
      {!collapsed && (
        <div className="px-6 mb-4">
          <div className="bg-spotify-darkgray rounded-full p-2 flex items-center">
            <Search size={18} className="text-spotify-lightgray mr-2" />
            <span className="text-spotify-lightgray">Search...</span>
          </div>
        </div>
      )}

      {/* Navigation items */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center p-3 rounded-md transition-colors",
                  isActive 
                    ? "bg-spotify-darkgray text-spotify-green" 
                    : "text-spotify-lightgray hover:text-white",
                  collapsed ? "justify-center" : "px-4"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-spotify-darkgray flex items-center justify-center">
        <ThemeSwitcher />
      </div>
    </aside>
  );
};

export default AppSidebar;
