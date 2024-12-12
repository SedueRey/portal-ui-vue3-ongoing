import {
  createRouter,
  createWebHashHistory,
  type NavigationGuardNext,
  type RouteLocationNormalizedGeneric,
  type RouteLocationNormalizedLoadedGeneric,
} from 'vue-router';
import DummyView from './app/DummyView.vue';
import routes from './app/app.routes';
import { useAuthStore } from './app/auth/store/auth';
import { usePageStore } from './app/shared/store/pages';

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
    Se prueba incluyendo `verify: true` en el meta de cualquier ruta
    Se tiene que tipar estrictamente la función verify para que no haya
    errores de linter.
  */
  const matchedRecord = to.matched.find((record) => record.meta.verify);
  if (matchedRecord && matchedRecord.meta.verify) {
    const verify: (
      to: RouteLocationNormalizedGeneric,
      from: RouteLocationNormalizedLoadedGeneric,
      next: NavigationGuardNext,
    ) => Promise<boolean> = matchedRecord.meta.verify as (
      to: RouteLocationNormalizedGeneric,
      from: RouteLocationNormalizedLoadedGeneric,
      next: NavigationGuardNext,
    ) => Promise<boolean>;
    if (!(await verify(to, from, next))) {
      next('/404');
      return;
    }
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    usePageStore().setPublic(false);
    const accesstoken = sessionStorage.getItem('accesstoken');
    // Safari stuff
    const shouldNavigate = !window._env_.isSafari;
    const waitTime = shouldNavigate && accesstoken ? 50 : 1000;
    window.setTimeout(async () => {
      if (useAuthStore().isLogged) {
        /*
          Necesarias dos cosas para el "modo kiosco":
          poner standalone: true, en las rutas correspondientes.
          Como si fuera el título, también hay que añadir en el mounted
          this.$store.commit('pages/SET_STANDALONE', true);
        */
        const isStandalone: boolean = !!to.meta.standalone;
        usePageStore().setStandalone(isStandalone);
      } else {
        if (to.name !== 'login') {
          sessionStorage.setItem('POSE_LOGIN_ROUTE_KEY', to.path);
        }
        if (shouldNavigate) {
          await useAuthStore().login();
        }
      }
    }, waitTime);
  } else {
    usePageStore().setPublic(false);
  }
  // Se hace la navegación.
  next();
});

export default router;
