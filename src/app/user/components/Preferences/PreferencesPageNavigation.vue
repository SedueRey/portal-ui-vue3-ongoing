<template>
  <PrivatePageNavigation :title="$t('preferences')">
    <router-link to="/preferences">
      {{ $t('sliders') }}
    </router-link>
    <router-link to="/preferences/notifications">
      {{ $t('notifications') }}
    </router-link>
  </PrivatePageNavigation>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import PrivatePageNavigation from '../Profile/PrivatePageNavigation.vue';

  export default defineComponent({
    name: 'PreferencesPageNavigation',
    components: {
      PrivatePageNavigation,
    },
  });
</script>
