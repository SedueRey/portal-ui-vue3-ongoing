<template>
  <section class="privatePage__container profileChangePassword" v-if="user">
    <ProfilePageNavigation :title="$t('profile')" />
    <article class="privatePage">
      <ol class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link to="/">
            {{ $t('micampus') }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">{{ $t('profile') }}: {{ $t('passwordChange') }}</li>
      </ol>
      <h1 class="privatePage__title">
        {{ $t('passwordChange') }}
      </h1>
      <iframe
        :title="$t('passwordChange')"
        class="profileChangePassword__iframe"
        height="700"
        :src="`//entrada.um.es/cambiaclave/?pose=${user.email}`"
      />
    </article>
  </section>
</template>

<script setup lang="ts">
  import ProfilePageNavigation from '../components/Profile/ProfilePageNavigation.vue';
  import { onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useI18n } from 'vue-i18n';
  import { usePageStore } from '@/app/shared/store/pages';
  import { useUserStore } from '../store/user';

  const { t } = useI18n();
  const { user } = storeToRefs(useUserStore());

  onMounted(() => {
    usePageStore().setTitle(t('profile'));
  });
</script>

<style lang="scss" src="../assets/_profilePreferences.scss" />
