import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout';
import {
  Dashboard,
  Electricity,
  Forecast,
  LPG,
  Transport,
  Water,
  Food,
  TodoNotTodo,
  Settings,
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
      { path: 'lpg', element: <LPG /> },
      { path: 'transport', element: <Transport /> },
      { path: 'water', element: <Water /> },
      { path: 'food', element: <Food /> },
      { path: 'forecast', element: <Forecast /> },
      { path: 'todo-not-todo', element: <TodoNotTodo /> },
      { path: 'settings', element: <Settings /> },
      { path: 'about', element: <About /> },
    ],
  },
]);