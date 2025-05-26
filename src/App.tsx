
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DocumentEditor from './pages/DocumentEditor';
import DmsHome from './pages/DmsHome';
import DmsRouter from './pages/DmsRouter';
import GoogleDriveDocView from './pages/GoogleDriveDocView';
import Home from './pages/Home';
import RftTasksDashboard from './pages/RftTasksDashboard';
import RftTaskDetail from './pages/RftTaskDetail';
import AuthPage from './pages/AuthPage';
import GoogleDriveTest from './pages/GoogleDriveTest';
import AdminRouter from './pages/AdminRouter';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import { Loader } from 'lucide-react';

// Custom error boundary component
const ErrorBoundary = () => {
  const error = useRouteError();
  console.error("Route error:", error);
  
  return <NotFound />;
};

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spotify-black">
        <Loader className="h-8 w-8 animate-spin text-spotify-green" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  // Define route configuration for React Router v7
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/auth",
      element: <AuthPage />,
    },
    {
      path: "/home",
      element: <ProtectedRoute><Home /></ProtectedRoute>,
    },
    {
      path: "/document-editor",
      element: <ProtectedRoute><DocumentEditor /></ProtectedRoute>,
    },
    {
      path: "/document-editor/:id",
      element: <ProtectedRoute><DocumentEditor /></ProtectedRoute>,
    },
    {
      path: "/dms",
      element: <ProtectedRoute><DmsRouter /></ProtectedRoute>,
      children: [
        {
          index: true,
          element: <DmsHome />,
        },
        {
          path: "documents/:id",
          element: <DocumentEditor />,
        },
      ],
    },
    {
      path: "/google-drive/documents/:id",
      element: <ProtectedRoute><GoogleDriveDocView /></ProtectedRoute>
    },
    {
      path: "/google-drive",
      element: <ProtectedRoute><GoogleDriveTest /></ProtectedRoute>
    },
    {
      path: "/rfts",
      element: <ProtectedRoute><RftTasksDashboard /></ProtectedRoute>
    },
    {
      path: "/rfts/:id",
      element: <ProtectedRoute><RftTaskDetail /></ProtectedRoute>
    },
    {
      path: "/admin/*",
      element: <ProtectedRoute><AdminRouter /></ProtectedRoute>
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]);

  return <RouterProvider router={router} />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
