import type { RouteRecordRaw } from 'vue-router';

const ProfilePicture = () => import('./views/ProfilePicture.vue');
const ProfileCard = () => import('./views/ProfileCard.vue');
const ProfileData = () => import('./views/ProfileData.vue');
const ProfileChangePassword = () => import('./views/ProfileChangePassword.vue');

const PreferencesSliders = () => import('./views/PreferencesSliders.vue');
const PreferencesNotifications = () => import('./views/PreferencesNotifications.vue');

export default [
  {
    path: '/profile',
    name: 'profile',
    redirect: '/profile/data',
  },
  {
    path: '/profile/photo',
    name: 'profilephoto',
    component: ProfilePicture,
    meta: {
      requiresAuth: true,
      group: 'user',
      application: 'profile',
    },
  },
  {
    path: '/profile/card',
    name: 'profilecard',
    component: ProfileCard,
    meta: {
      requiresAuth: true,
      group: 'user',
      application: 'profile-card',
    },
  },
  {
    path: '/profile/data',
    name: 'profiledata',
    component: ProfileData,
    meta: {
      requiresAuth: true,
      group: 'user',
      application: 'profile-data',
    },
  },
  {
    path: '/profile/password',
    name: 'profilechangepassword',
    component: ProfileChangePassword,
    meta: {
      requiresAuth: true,
      group: 'user',
      application: 'profile-change-password',
    },
  },
  {
    path: '/preferences',
    name: 'preferences',
    component: PreferencesSliders,
    meta: {
      requiresAuth: true,
      group: 'user',
      application: 'preferences',
    },
  },
  {
    path: '/preferences/notifications',
    name: 'preferencesNotifications',
    component: PreferencesNotifications,
    meta: {
      requiresAuth: true,
      group: 'user',
      application: 'preferences-notifications',
    },
  },
] as RouteRecordRaw[];
