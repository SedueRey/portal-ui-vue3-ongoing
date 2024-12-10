import { computed } from 'vue';
import { useUserStore } from '../store/user';

export function useRoleComposable() {
  const userStore = useUserStore();

  const isPasPdi = computed(() => {
    if (!userStore.user) {
      return false;
    }
    const roleString = userStore.user.roleName.type.join(' ').toLowerCase();
    if (roleString) {
      return roleString.indexOf('pas') > -1 || roleString.indexOf('pdi') > -1;
    }
    return false;
  });

  const isPas = computed(() => {
    if (!userStore.user) {
      return false;
    }
    const roleString = userStore.user.roleName.type.join(' ').toLowerCase();
    if (roleString) {
      return roleString.indexOf('pas') > -1;
    }
    return false;
  });

  return {
    isPasPdi,
    isPas,
  };
}
