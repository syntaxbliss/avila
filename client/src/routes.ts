export const appRoutes = {
  materials: { index: '/material', create: '/material/create', edit: '/material/:materialId/edit' },
  suppliers: { index: '/supplier', create: '/supplier/create', edit: '/supplier/:supplierId/edit' },
  purchaseOrders: { index: '/purchase-order', create: '/purchase-order/create' },
  requestForQuotations: {
    index: '/request-for-quotation',
    create: '/request-for-quotation/create',
  },
} as const;

export const defaultRoute = appRoutes.materials.index;
