import HomeView from './views/HomeView.vue';
import SearchView from './views/SearchView.vue';

const DetailView = () => import('./views/DetailView.vue');
const AggregatedView = () => import('./views/AggregatedView.vue');

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
    component: SearchView,
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
    component: DetailView,
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
    component: AggregatedView,
    meta: {
      requiresAuth: true,
      group: 'campus-virtual',
      application: 'portal-servicios',
    },
  },
];
