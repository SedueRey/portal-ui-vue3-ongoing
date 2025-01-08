import AuthRoutes from './auth/module.routes';
import GuiasDocentesRoutes from './campus-virtual/historico-guias/module.routes';
import type { RouteRecordRaw } from 'vue-router';
import UserRoutes from './user/module.routes';
export default [...AuthRoutes, ...UserRoutes, ...GuiasDocentesRoutes] as RouteRecordRaw[];
