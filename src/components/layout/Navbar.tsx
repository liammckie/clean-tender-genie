
import { useState } from 'react';
import { Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [notifications] = useState(3);

  return (
    <nav className="bg-spotify-black border-b border-spotify-darkgray px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-white">RFT Assistant</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-spotify-lightgray" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-spotify-green text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-spotify-lightgray" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5 text-spotify-lightgray" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-spotify-darkgray border-spotify-gray">
              <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-spotify-gray" />
              <DropdownMenuItem className="text-spotify-lightgray hover:text-white">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-spotify-lightgray hover:text-white">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-spotify-gray" />
              <DropdownMenuItem className="text-spotify-lightgray hover:text-white">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
