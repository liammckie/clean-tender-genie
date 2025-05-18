
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
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
import GoogleDriveTestPage from './pages/GoogleDriveTestPage';
import AdminRouter from './pages/AdminRouter';

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Home /> : <LoginPage />,
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
          path: "/dms",
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
      element: <GoogleDriveTestPage />
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
      path: "/admin",
      element: <AdminRouter />
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default App;
