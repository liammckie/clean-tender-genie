
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import DocumentEditor from './pages/DocumentEditor';
import DmsHome from './pages/DmsHome';
import DmsRouter from './pages/DmsRouter';
import GoogleDriveDocView from './pages/GoogleDriveDocView';
import Home from './pages/Home';
import RftTasksDashboard from './pages/RftTasksDashboard';
import { useAuth } from './contexts/AuthContext';
import RftTaskDetail from './pages/RftTaskDetail';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GoogleDriveTest from './pages/GoogleDriveTest';
import AdminRouter from './pages/AdminRouter';
import NotFound from './pages/NotFound';

// Custom error boundary component
const ErrorBoundary = () => {
  const error = useRouteError();
  console.error("Route error:", error);
  
  return <NotFound />;
};

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();

  // Define route configuration for React Router v7
  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Home /> : <LoginPage />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "/document-editor",
      element: <DocumentEditor />,
    },
    {
      path: "/document-editor/:id",
      element: <DocumentEditor />,
    },
    {
      path: "/dms",
      element: <DmsRouter />,
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
      element: <GoogleDriveDocView />
    },
    {
      path: "/google-drive",
      element: <GoogleDriveTest />
    },
    {
      path: "/rfts",
      element: <RftTasksDashboard />
    },
    {
      path: "/rfts/:id",
      element: <RftTaskDetail />
    },
    {
      path: "/admin/*",
      element: <AdminRouter />
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default App;
