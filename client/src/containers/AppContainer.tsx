import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Layout } from '../components';
import { appRoutes } from '../routes';
import DashboardContainer from './dashboard/DashboardContainer';
import MaterialsContainer from './materials/MaterialsContainer';
import MaterialFormContainer from './materials/MaterialFormContainer';
import SuppliersContainer from './suppliers/SuppliersContainer';
import SupplierFormContainer from './suppliers/SupplierFormContainer';
import PurchaseOrdersContainer from './purchase-orders/PurchaseOrdersContainer';
import PurchaseOrderFormContainer from './purchase-orders/PurchaseOrderFormContainer';

const routes = [
  { path: appRoutes.dashboard.index, element: DashboardContainer },
  { path: appRoutes.materials.index, element: MaterialsContainer },
  { path: appRoutes.materials.create, element: MaterialFormContainer },
  { path: appRoutes.materials.edit, element: MaterialFormContainer },
  { path: appRoutes.suppliers.index, element: SuppliersContainer },
  { path: appRoutes.suppliers.create, element: SupplierFormContainer },
  { path: appRoutes.suppliers.edit, element: SupplierFormContainer },
  { path: appRoutes.purchaseOrders.index, element: PurchaseOrdersContainer },
  { path: appRoutes.purchaseOrders.create, element: PurchaseOrderFormContainer },
];

export default function AppContainer(): JSX.Element {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {routes.map(route => (
            <Route key={route.path} path={route.path} element={<route.element />} />
          ))}

          <Route path="*" element={<Navigate to={appRoutes.dashboard.index} />} />
        </Routes>

        <Outlet />
      </Layout>
    </BrowserRouter>
  );
}
