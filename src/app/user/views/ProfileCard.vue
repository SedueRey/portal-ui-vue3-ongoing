<template>
  <section class="privatePage__container">
    <ProfilePageNavigation :title="$t('profile')" />
    <article class="privatePage">
      <ol class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link to="/">
            {{ $t('micampus') }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">{{ $t('profile') }}: {{ $t('tui') }}</li>
      </ol>
      <h1 class="privatePage__title">
        {{ $t('tui') }}
      </h1>
      <div class="panel privatePage__changePhoto">
        <div class="panel-space panel-dark panel-top panel-columns">
          <span class="card-panel">
            <i class="fal fa-id-card" />
          </span>
          <p>
            {{ $t('card1') }} <br /><br />
            <a href="//www.um.es/en/web/atica/tui" target="_blank">{{ $t('more') }}&hellip;</a>
          </p>
        </div>
        <div class="panel-space panel-bottom">
          <p class="panel-columns panel-bottom-bordered">
            <span>{{ $t('card2') }}</span>
            <a
              href="https://administracionsv.um.es/tui/paginas/mantenimientos/solicitudTarjeta.seam"
              class="pose__button width-card no-margin"
              target="_blank"
            >
              {{ $t('newTUIButton') }}
            </a>
          </p>
          <p class="panel-columns">
            <span>{{ $t('card3') }}</span>
            <a
              href="https://administracionsv.um.es/tui/paginas/mantenimientos/activaTUI.seam"
              class="pose__button width-card no-margin"
              target="_blank"
            >
              {{ $t('newTUIBActivate') }}
            </a>
          </p>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted } from 'vue';
  import ProfilePageNavigation from '../components/Profile/ProfilePageNavigation.vue';
  import { useI18n } from 'vue-i18n';
  import { usePageStore } from '@/app/shared/store/pages';

  const { t } = useI18n();

  onMounted(() => {
    usePageStore().setTitle(t('profile'));
    document.body.classList.toggle('with-menu');
  });

  onBeforeUnmount(() => {
    document.body.classList.toggle('with-menu');
  });
</script>

<style lang="scss" src="../assets/_profilePreferences.scss" />
