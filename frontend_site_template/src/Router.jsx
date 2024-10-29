import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import Register from './pages/Register';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <Register />,
      },
    ],
  },
  {
    path: '/home',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
