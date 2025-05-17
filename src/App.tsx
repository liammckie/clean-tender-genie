
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
import Login from './pages/Login';
import { useAuth } from './contexts/AuthContext';
import Signup from './pages/Signup';
import RftTaskDetail from './pages/RftTaskDetail';

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Home /> : <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
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
      path: "google-drive/documents/:id",
      element: <GoogleDriveDocView />
    },
    {
      path: "/rfts",
      element: <RftTasksDashboard />
    },
    {
      path: "rfts/:id",
      element: <RftTaskDetail />
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default App;
