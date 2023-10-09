import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Layout } from '../components';
import * as routes from '../routes';
import MaterialsContainer from './materials/MaterialsContainer';
import MaterialFormContainer from './materials/MaterialFormContainer';
import SuppliersContainer from './suppliers/SuppliersContainer';
import SupplierFormContainer from './suppliers/SupplierFormContainer';
import PurchaseOrdersContainer from './purchase-orders/PurchaseOrdersContainer';
import PurchaseOrderFormContainer from './purchase-orders/PurchaseOrderFormContainer';
import RequestForQuotationFormContainer from './request-for-quotation/RequestForQuotationFormContainer';
import RequestsForQuotationContainer from './request-for-quotation/RequestsForQuotationContainer';

const routesList = [
  { path: routes.appRoutes.materials.index, element: MaterialsContainer },
  { path: routes.appRoutes.materials.create, element: MaterialFormContainer },
  { path: routes.appRoutes.materials.edit, element: MaterialFormContainer },
  { path: routes.appRoutes.suppliers.index, element: SuppliersContainer },
  { path: routes.appRoutes.suppliers.create, element: SupplierFormContainer },
  { path: routes.appRoutes.suppliers.edit, element: SupplierFormContainer },
  { path: routes.appRoutes.purchaseOrders.index, element: PurchaseOrdersContainer },
  { path: routes.appRoutes.purchaseOrders.create, element: PurchaseOrderFormContainer },
  { path: routes.appRoutes.requestsForQuotation.index, element: RequestsForQuotationContainer },
  { path: routes.appRoutes.requestsForQuotation.create, element: RequestForQuotationFormContainer },
];

export default function AppContainer(): JSX.Element {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {routesList.map(route => (
            <Route key={route.path} path={route.path} element={<route.element />} />
          ))}

          <Route path="*" element={<Navigate to={routes.defaultRoute} />} />
        </Routes>

        <Outlet />
      </Layout>
    </BrowserRouter>
  );
}
