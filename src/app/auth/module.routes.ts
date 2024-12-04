import Forbidden2FA from './views/Forbidden2FA.vue';
import LoginView from './views/LoginView.vue';
import type { RouteRecordRaw } from 'vue-router';

const FeatureFlag = () => import('./views/FeatureFlag.vue');

export default [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      group: 'auth',
      application: 'login',
    },
  },
  {
    path: '/feature-flag/:params+',
    name: 'FeatureFlag',
    component: FeatureFlag,
    meta: {
      group: 'auth',
      application: 'feature-flag',
    },
  },
  {
    path: '/forbidden2FA',
    name: 'forbidden2FA',
    component: Forbidden2FA,
    meta: {
      requiresAuth: true,
      group: 'auth',
      application: 'forbidden',
    },
  },
] as RouteRecordRaw[];
