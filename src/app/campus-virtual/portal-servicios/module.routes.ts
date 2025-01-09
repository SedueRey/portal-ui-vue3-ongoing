import DummyView from '@/app/DummyView.vue';
import HomeView from './views/HomeView.vue';

export default [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      group: 'campus-virtual',
      application: 'portal-servicios',
    },
  },
  {
    path: '/search/:tag',
    props: true,
    name: 'search',
    component: DummyView,
    meta: {
      requiresAuth: true,
      group: 'campus-virtual',
      application: 'portal-servicios',
    },
  },
  {
    path: '/detail/:identifier',
    props: true,
    name: 'detail',
    component: DummyView,
    meta: {
      requiresAuth: true,
      group: 'campus-virtual',
      application: 'portal-servicios',
    },
  },
  {
    path: '/view/:route/:identifier?',
    props: true,
    name: 'aggregated',
    component: DummyView,
    meta: {
      requiresAuth: true,
      group: 'campus-virtual',
      application: 'portal-servicios',
    },
  },
];
