export const appRoutes = {
  machines: { index: '/machine', create: '/machine/create', edit: '/machine/:machineId/edit' },
  materials: { index: '/material', create: '/material/create', edit: '/material/:materialId/edit' },
  parts: { index: '/part', create: '/part/create', edit: '/part/:partId/edit' },
  purchaseOrders: { index: '/purchase-order', create: '/purchase-order/create' },
  requestsForQuotation: {
    index: '/request-for-quotation',
    create: '/request-for-quotation/create',
  },
  suppliers: { index: '/supplier', create: '/supplier/create', edit: '/supplier/:supplierId/edit' },
} as const;

export const defaultRoute = appRoutes.materials.index;
