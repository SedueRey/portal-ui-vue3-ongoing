<template>
  <PrivatePageNavigation title="Mi perfil">
    <router-link to="/profile/data">
      {{ $t('personalData') }}
    </router-link>
    <router-link to="/profile/photo">
      {{ $t('officialPhoto') }}
    </router-link>
    <router-link to="/profile/card">
      {{ $t('tui') }}
    </router-link>
    <router-link to="/profile/password">
      {{ $t('passwordChange') }}
    </router-link>
    <routerLink v-if="isPas" to="/profile/gestion-horaria">
      {{ $t('kron') }}
    </routerLink>
  </PrivatePageNavigation>
</template>

<script setup lang="ts">
  import PrivatePageNavigation from './PrivatePageNavigation.vue';
  import { useRoleComposable } from '../../composables/useRoleComposable';

  const { isPas } = useRoleComposable();
</script>
