import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { routes as authRoutes } from './auth/routes';
import { routes as listRoutes } from './list/routes';
import { routes as profileRoutes } from './profile/routes';

import Layout from '../features/app/Layout/Layout';
import ErrorPage from './ErrorPage/ErrorPage';

const MainPage = lazy(() => import('./main/MainPage'));
const WelcomePage = lazy(() => import('./welcome/WelcomePage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout disableMaxWidth={true} />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'auth',
        children: authRoutes,
      },
      {
        path: 'welcome',
        element: <WelcomePage />,
      },
      {
        path: 'list',
        children: listRoutes,
      },
      {
        path: 'profile',
        children: profileRoutes,
      },
    ],
  },
];
