import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const ProductManagement = React.lazy(() => import('./views/ProductManagement'));
const ServiceManagement = React.lazy(() => import('./views/ServiceManagement'));
const ProductOrder = React.lazy(() => import('./views/ProductOrder'));
const ServiceOrder = React.lazy(() => import('./views/ServiceOrder'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  // { path: '/theme', name: 'Theme', component: Colors, exact: true },
  // { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/product-management', name: 'Product Management', component: ProductManagement},
  { path: '/service-management', name: 'Service Management', component: ServiceManagement},
  { path: '/product-order', name: 'Product Order', component: ProductOrder},
  { path: '/service-order', name: 'Service Order', component: ServiceOrder},
];

export default routes;
