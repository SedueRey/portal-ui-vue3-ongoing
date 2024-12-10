import AuthRoutes from './auth/module.routes';
import type { RouteRecordRaw } from 'vue-router';
import UserRoutes from './user/module.routes';
export default [...AuthRoutes, ...UserRoutes] as RouteRecordRaw[];
