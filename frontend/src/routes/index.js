import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import FlightBoard from '../pages/FlightBoard';
import LiveMessage from '../pages/LiveMessage';
import Flight from '../pages/Flight';
import ScreenManagement from '../pages/ScreenManagement';
import AdminLayout from '../components/Layout/AdminLayout';
import Setting from '../pages/Setting';

export const publicRoutes = [
  {
    path: '/',
    component: FlightBoard,
    layout: null,
  },
  {
    path: '/login',
    component: Login,
    layout: null,
  },
  {
    path: '*',
    component: NotFound,
  },
];

export const privateRoutes = [
  {
    path: '/admin',
    component: Setting,
    layout: AdminLayout,
  },
  {
    path: '/flight',
    component: Flight,
    layout: AdminLayout,
  },
  {
    path: '/live-message',
    component: LiveMessage,
    layout: AdminLayout,
  },
  {
    path: '/screen-management',
    component: ScreenManagement,
    layout: AdminLayout,
  },
  {
    path: '/setting',
    component: Setting,
    layout: AdminLayout,
  },
];
