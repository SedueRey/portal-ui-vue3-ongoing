import { createRouter, createWebHashHistory } from 'vue-router';
import DummyView from './app/DummyView.vue';
import appRoutes from './app/app.routes';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dummy',
      component: DummyView,
    },
    ...appRoutes,
  ],
});

router.afterEach((to) => {
  if (to.name !== 'login') {
    sessionStorage.setItem('POSE_LOGIN_ROUTE_KEY', to.path);
  }
});

router.beforeEach(async (to, from, next) => {
  console.log('to', to, 'from', from);
  next();
});

export default router;
