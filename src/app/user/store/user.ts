import { type Ref, computed, ref } from 'vue';
import type { WhoamiUserDataResponse } from '../api/user.contracts';
import { defineStore } from 'pinia';
import { useAuthStore } from '@/app/auth/store/auth';
import userApi from '../api/user.api';

export const useUserStore = defineStore('user', () => {
  const user: Ref<WhoamiUserDataResponse | null> = ref(null);
  // Mutaciones
  const setUserMutation = (userData: WhoamiUserDataResponse): void => {
    user.value = userData;
    window.sessionStorage.setItem('p15s-roles', JSON.stringify(user.value.roleName));
    window.localStorage.setItem('p15s-useruuid', btoa(user.value.email));
  };
  // Acciones
  const setUser = () => {
    userApi
      .whoAmI()
      .then((response) => response.data)
      .then((user) => {
        setUserMutation(user);
        useAuthStore().setAdmin(user.isAdmin && user.isAdmin === true);
      });
  };
  // Getters
  const hasRoles = computed(() => (user.value !== null ? user.value.roleName : []));
  const isAdmin: Ref<boolean> = computed(() => user.value?.isAdmin === true);
  const isNewUser: Ref<boolean> = computed(
    () => (user.value && user.value.newUser && user.value.newUser === '1') || false,
  );
  const userIsLoaded: Ref<boolean> = computed(() => user.value !== null);
  return {
    user,
    // Acciones
    setUser,
    // Getters
    hasRoles,
    isAdmin,
    isNewUser,
    userIsLoaded,
  };
});
