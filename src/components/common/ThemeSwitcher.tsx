
import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeSwitcher: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default to dark mode for Spotify theme

  useEffect(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark for Spotify theme unless explicitly set to light
    const initialDarkMode = savedTheme === 'light' ? false : true;
    
    setIsDarkMode(initialDarkMode);
    
    // Apply theme class to document
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-spotify-darkgray hover:bg-spotify-gray text-spotify-lightgray hover:text-white transition-colors"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeSwitcher;
