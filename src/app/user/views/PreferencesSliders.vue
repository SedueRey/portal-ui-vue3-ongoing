<template>
  <section class="privatePage__container">
    <PreferencesPageNavigation :title="$t('preferences')" />
    <article class="privatePage">
      <ol class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link to="/">
            {{ $t('home') }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">{{ $t('preferences') }}: {{ $t('sliders') }}</li>
      </ol>
      <h1 class="privatePage__title">
        {{ $t('sliders') }}
      </h1>
      <p class="privatePage__subtitle">{{ $t('helpCarriles') }}</p>
      <slider-preferences-list />
    </article>
  </section>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted } from 'vue';
  import PreferencesPageNavigation from '../components/Preferences/PreferencesPageNavigation.vue';
  // TO-DO: Empezar con los sliders
  // import SliderPreferencesList from '@/app/campus-virtual/portal-servicios/components/SliderPreferencesList.vue';
  import { useI18n } from 'vue-i18n';
  import { usePageStore } from '@/app/shared/store/pages';
  const { t } = useI18n();

  onMounted(() => {
    usePageStore().setTitle(t('sliders'));
    document.body.classList.toggle('with-menu');
  });

  onBeforeUnmount(() => {
    document.body.classList.toggle('with-menu');
  });
</script>

<style lang="scss" src="../assets/_profilePreferences.scss" />
