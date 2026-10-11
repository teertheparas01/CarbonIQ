import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout';
import {
  Dashboard,
  Electricity,
  LPG,
  Water,
  Food,
  Transport,
  Forecast,
  TodoNotTodo,
  Settings,
  Landing,
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
      { path: 'water', element: <Water /> },
      { path: 'food', element: <Food /> },
      { path: 'transport', element: <Transport /> },
      { path: 'forecast', element: <Forecast /> },
      { path: 'todo-not-todo', element: <TodoNotTodo /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);