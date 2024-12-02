<template>
  <div class="featureFlag">Feature flag<br /></div>
</template>

<script setup lang="ts">
  import { onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();

  onMounted(() => {
    watch(
      () => route.params,
      () => {
        const { params } = route.params;
        if (Array.isArray(params)) {
          window.sessionStorage.setItem('featureFlagActive', 'on');
          router.replace(`/${params.join('/')}`);
        }
      },
      { immediate: true },
    );
  });
</script>
