<template>
  <aside class="sessionExpire__container" v-if="isLogged && shouldShow">
    <div class="sessionExpire">
      <Message severity="warn" :closable="false" style="box-shadow: var(--shadowLevel-2)">
        <div class="sessionExpire__info">
          <span v-if="timedOut()">
            {{ $t('expired') }}
          </span>
          <span v-else>
            {{ $t('warn') }}
            <span v-if="minutes > 0">
              <strong>
                {{ minutes }}
              </strong>
              {{ $t('minutes') }}
            </span>
            <strong>
              {{ seconds }}
            </strong>
            {{ $t('seconds') }}
          </span>
          <button
            @click="reloadSession"
            @keyup.enter="reloadSession"
            @keyup.space="reloadSession"
            class="pose__button no-margin"
          >
            {{ $t('reload') }}
          </button>
        </div>
      </Message>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
  import { nowUTC, timeDiffCalc } from '@/app/shared/utils/utils';
  import Message from 'primevue/message';
  // import { useStore } from 'vuex';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '../store/auth';

  const authStore = useAuthStore();
  const { isLogged, expires } = storeToRefs(authStore);

  const loaded = ref(false);
  const timer: Ref<null | ReturnType<typeof setTimeout>> = ref(null);
  const seconds = ref(-1);
  const minutes = ref(-1);
  const hours = ref(-1);

  const shouldShow = computed(() => {
    return (
      isLogged.value && loaded.value && (timedOut() || (minutes.value >= 0 && minutes.value < 3))
    );
  });

  const reloadSession = async () => {
    useAuthStore().revokeToken();
    await useAuthStore().login();
  };

  const timedOut = () => {
    if (!expires.value) return false;
    return (minutes.value === 0 && seconds.value === 0) || expires.value - nowUTC() < 0;
  };

  onMounted(() => {
    if (timer.value) {
      clearInterval(timer.value);
    }
    timer.value = setInterval(() => {
      loaded.value = true;
      const now = nowUTC();
      const { hours: h, minutes: m, seconds: s } = timeDiffCalc(expires.value, now);
      hours.value = h;
      minutes.value = m;
      seconds.value = s;
    }, 1000);
  });

  onBeforeUnmount(() => {
    if (timer.value) {
      clearInterval(timer.value);
    }
  });
</script>

<i18n>
{
  "en": {
    "reload": "Reload",
    "warn": "Attention, your session will expire in",
    "expired": "Sorry, Your session has expired",
    "minutes": "minutes and ",
    "seconds": "seconds"
  },
  "es": {
    "reload": "Recargar",
    "expired": "Lo sentimos, su sesión ha caducado",
    "warn": "Atención, su sesión caducará en",
    "minutes": "minutos y ",
    "seconds": "segundos"
  }
}
</i18n>

<style lang="scss">
  .sessionExpire {
    background: transparent;
    position: fixed;
    bottom: 2rem;
    z-index: 10;

    @media (max-width: $screen-sm-min) {
      left: 1rem;
      right: 1rem;
      bottom: 4rem;
      * {
        font-size: 0.75rem;
      }
    }

    .p-message-text {
      width: 44rem;
    }

    .p-message.p-message-warn {
      background-color: var(--message-warning);
    }

    &__container {
      background: transparent;
      max-width: 48rem;
      margin: 0 auto;
      z-index: 10;
      @media (max-width: $screen-sm-min) {
        position: fixed;
        top: unset;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem 2rem;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 90%);

        .p-message .p-message-text {
          font-size: 0.875rem;
          padding: 0.25rem;
          text-align: center;
        }

        .p-message-icon {
          display: none;
        }
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
      gap: 1rem;
      justify-content: space-between;
      align-content: center;
      @media (min-width: $screen-sm-min) {
        flex-direction: row;
      }
    }
  }
</style>
