import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout';
import {
  Dashboard,
  Electricity,
  Forecast,
  Landing,
  About,
} from './pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'electricity', element: <Electricity /> },
      { path: 'forecast', element: <Forecast /> },
      { path: 'about', element: <About /> },
    ],
  },
]);