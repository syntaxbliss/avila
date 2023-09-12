export const appRoutes = {
  dashboard: { index: '/' },
  materials: { index: '/material', create: '/materia/create', edit: '/material/:materialId/edit' },
} as const;
