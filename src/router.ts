import { createRouter, createWebHashHistory } from 'vue-router';
import DummyView from './app/DummyView.vue';
import routes from './app/app.routes';
import { useAuthStore } from './app/auth/store/auth';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dummy',
      component: DummyView,
    },
    ...routes,
  ],
});

router.afterEach((to) => {
  if (to.name !== 'login') {
    sessionStorage.setItem('POSE_LOGIN_ROUTE_KEY', to.path);
  }
});

router.beforeEach(async (to, from, next) => {
  const group = typeof to.meta.group === 'string' ? to.meta.group : '';
  const application = typeof to.meta.application === 'string' ? to.meta.application : '';
  sessionStorage.setItem('POSE_LOG_GROUP', group);
  sessionStorage.setItem('POSE_LOG_APPLICATION', application);

  /*
    Se prueba incluyendo `needs2FA: true` en el meta de cualquier ruta
    (por ejemplo en el detail:
    src\app\campus-virtual\portal-servicios\module.routes.js)
  */
  if (to.matched.some((record) => record.meta.requiresAuth && record.meta.needs2FA)) {
    if (useAuthStore().valid2FA) {
      sessionStorage.setItem('POSE_FORBIDDEN2FA_ROUTE_KEY', to.path);
      useAuthStore().set2faNeeded(true);
      next('/forbidden2FA');
      return;
    }
  }

  if (to.matched.some((record) => record.meta.hiddenFeature)) {
    const featureFlagActive = sessionStorage.getItem('featureFlagActive');
    if (!featureFlagActive) {
      next('/404');
      return;
    }
  }

  /*
  Se verifica que se cumple el criterio establecido.
 */
  /*
  if (to.matched.some((record) => record.meta.verify)) {
    const verify = to.matched.find((record) => record.meta.verify)?.meta?.verify;
    if (verify && !(await verify(to, from, next))) {
      next('/404');
      return;
    }
  }
*/
  next();
});

export default router;
