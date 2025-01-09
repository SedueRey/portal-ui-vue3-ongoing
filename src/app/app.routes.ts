import AuthRoutes from './auth/module.routes';
import GuiasDocentesRoutes from './campus-virtual/historico-guias/module.routes';
import PoseRoutes from './campus-virtual/portal-servicios/module.routes';
import type { RouteRecordRaw } from 'vue-router';
import UserRoutes from './user/module.routes';
export default [
  ...PoseRoutes,
  ...AuthRoutes,
  ...UserRoutes,
  ...GuiasDocentesRoutes,
] as RouteRecordRaw[];
