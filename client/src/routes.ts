export const appRoutes = {
  dashboard: { index: '/' },
  materials: { index: '/material', create: '/material/create', edit: '/material/:materialId/edit' },
  suppliers: { index: '/supplier', create: '/supplier/create', edit: '/supplier/:supplierId/edit' },
  purchaseOrders: { create: '/purchase-order/create' },
} as const;
