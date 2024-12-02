<template>
  <div class="forbidden2FA">
    <div class="forbidden2FA__flexItems">
      <h1 class="forbidden2FA__title">{{ $t('forbidden_title') }}</h1>
      <div class="grid">
        <div class="forbidden2FA__message col-12">
          {{ $t('forbidden_message', { genderText: userTextGender }) }}
        </div>
        <div class="col-12 text-center pt-2">
          <fwjsTimer :timeLimit="redirectTimeout" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import fwjsTimer from '@/app/shared/components/fwjsTimer.vue';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '../store/auth';
  import { useI18n } from 'vue-i18n';
  import { usePageStore } from '@/app/shared/store/pages';
  import { useUserStore } from '@/app/user/store/user';

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const { t } = useI18n();

  const redirectTimeout = ref(10);

  const userTextGender = computed(() => {
    if (user.value && user.value.afiliacion && user.value.afiliacion.sexo) {
      if (user.value.afiliacion.sexo === 'M') {
        return t('female_text');
      }
      if (user.value.afiliacion.sexo === 'V') {
        return t('male_text');
      }
    }
    return t('mix_text');
  });

  const loginLoaMedium = () => {
    useAuthStore().loginLoaMedium();
  };

  onMounted(() => {
    usePageStore().setTitle(t('forbidden_title_sub'));
    setTimeout(() => {
      loginLoaMedium();
    }, redirectTimeout.value * 1000);
  });
</script>

<style lang="scss" scoped>
  .forbidden2FA {
    width: 100vw;
    min-height: 87vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--privatebgcolor);

    &__flexItems {
      background-color: var(--card-bg-color);
      max-width: var(--detail-grid-width);
      margin: 0 1rem;
      padding: 2rem 1.5rem;
      border-radius: 1rem;
      box-shadow: var(--shadowLevel-2);
    }

    &__title {
      color: var(--main-text-color);
      font-size: 1.875rem;
      padding-top: 0;
      margin-top: 0;
      /* TO-DO
      @media (max-width: $screen-sm-min) {
        font-size: 1.5rem;
      }
      */
    }

    &__message {
      line-height: 1.5;
    }
  }
</style>
