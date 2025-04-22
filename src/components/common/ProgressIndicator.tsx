
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProgressTracker } from '@/hooks/use-progress-tracker';

interface ProgressIndicatorProps {
  sections: string[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ sections }) => {
  const location = useLocation();
  const { visitedPages, markPageVisited, getProgress } = useProgressTracker();
  const progress = getProgress(sections);

  useEffect(() => {
    markPageVisited(location.pathname);
  }, [location.pathname, markPageVisited]);

  return (
    <div className="mt-8 mb-4">
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700">Knowledge Progress</span>
        <span className="ml-auto text-sm font-medium text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
