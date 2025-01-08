const HomeSyllabus = () => import(/* webpackChunkName: "gd-Home" */ './views/HomeSyllabus.vue');

const basePath = '/historico/guiadocente/';

export default [
  {
    path: `${basePath}`,
    name: 'gd-home',
    component: HomeSyllabus,
    meta: {
      group: 'campus-virtual',
      application: 'historico-guias',
    },
  },
  {
    path: `${basePath}/search/:search?/:timestamp?`,
    name: 'gd-search',
    component: HomeSyllabus,
    meta: {
      group: 'campus-virtual',
      application: 'historico-guias',
    },
  },
  {
    path: `${basePath}/guia/:type/:id`,
    name: 'gd-list',
    component: HomeSyllabus,
    meta: {
      group: 'campus-virtual',
      application: 'historico-guias',
    },
  },
];
