import { useState, useEffect } from 'react';

interface ProgressTracking {
  [key: string]: boolean; // path: visited
}

export function useProgressTracker() {
  const [visitedPages, setVisitedPages] = useState<ProgressTracking>(() => {
    const savedProgress = localStorage.getItem('knowledge_progress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  const markPageVisited = (path: string) => {
    setVisitedPages((prev) => {
      const updated = { ...prev, [path]: true };
      localStorage.setItem('knowledge_progress', JSON.stringify(updated));
      return updated;
    });
  };

  const getProgress = (paths: string[]) => {
    if (paths.length === 0) return 0;
    const visitedCount = paths.filter((path) => visitedPages[path]).length;
    return (visitedCount / paths.length) * 100;
  };

  const resetProgress = () => {
    localStorage.removeItem('knowledge_progress');
    setVisitedPages({});
  };

  return {
    visitedPages,
    markPageVisited,
    getProgress,
    resetProgress,
  };
}
