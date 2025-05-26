
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  FileText, 
  Settings, 
  LogOut,
  FolderOpen,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AppSidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'RFT Tasks', href: '/rfts', icon: FileText },
    { name: 'Document Management', href: '/dms', icon: FolderOpen },
    { name: 'Google Drive', href: '/google-drive', icon: FolderOpen },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Admin', href: '/admin', icon: Settings },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col w-64 bg-spotify-darkgray border-r border-spotify-gray">
      <div className="flex items-center justify-center h-16 px-4 border-b border-spotify-gray">
        <h1 className="text-xl font-bold text-white">RFT Generator</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href !== '/' && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-spotify-green text-black"
                  : "text-spotify-lightgray hover:bg-spotify-gray hover:text-white"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-spotify-gray">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white truncate">
              {user.email}
            </p>
            <p className="text-xs text-spotify-lightgray">User</p>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full"
          size="sm"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AppSidebar;
