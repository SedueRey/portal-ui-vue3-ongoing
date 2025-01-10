<template>
  <div class="myEventsContainer" :class="className" v-if="isLogged">
    <my-events-maximized @minimize="toggleMaximize()" v-if="maximizeEvents" />
    <my-events-minimized @maximize="toggleMaximize()" v-else />
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, ref } from 'vue';
  import MyEventsMaximized from './MyEventsMaximized.vue';
  import MyEventsMinimized from './MyEventsMinimized.vue';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { useServicesStore } from '../store/services';

  const { isLogged } = storeToRefs(useAuthStore());
  const { maximizeEvents } = storeToRefs(useServicesStore());
  const showMaximizedComponent = ref<boolean | null>(null);
  const loading = ref(false);

  const className = computed(() => {
    let css = ' ';
    css += showMaximizedComponent.value ? 'is-maximized' : 'is-minimized';
    if (loading.value) {
      css += ' is-loading';
    }
    return css;
  });

  const toggleMaximize = () => {
    maximizeEvents.value = !maximizeEvents.value;
  };

  onBeforeMount(() => {
    showMaximizedComponent.value = maximizeEvents.value || false;
  });
</script>

<style lang="scss">
  .myEventsContainer {
    padding: 0 0 2rem 0;
    transition: all 0.25s ease-in-out;
  }
</style>
