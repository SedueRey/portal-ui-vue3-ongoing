<template>
  <div />
</template>

<script lang="ts" setup>
  import { onBeforeMount } from 'vue';
  import { useAuthStore } from '../store/auth';
  const authStore = useAuthStore();

  onBeforeMount(async () => {
    console.log('onBeforeMount LoginView');
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    console.log('code', code);
    if (!!code) {
      await authStore.accessToken(code);
    }
  });
</script>
