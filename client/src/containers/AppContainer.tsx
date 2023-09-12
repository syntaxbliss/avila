import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Layout } from '../components';
import DashboardContainer from './dashboard/DashboardContainer';
import MaterialsContainer from './materials/MaterialsContainer';
import { RouteURL } from '../types';

const routes = [
  { path: RouteURL.DASHBOARD, element: DashboardContainer },
  { path: RouteURL.MATERIALS, element: MaterialsContainer },
];

export default function AppContainer(): JSX.Element {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {routes.map(route => (
            <Route key={route.path} path={route.path} element={<route.element />} />
          ))}

          <Route path="*" element={<Navigate to={RouteURL.DASHBOARD} />} />
        </Routes>

        <Outlet />
      </Layout>
    </BrowserRouter>
  );
}
