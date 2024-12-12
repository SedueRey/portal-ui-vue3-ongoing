<template>
  <header
    class="fwjsHeader"
    :class="{ is__fixed: props.fixed, is__sticky: props.sticky || scrollSticky }"
  >
    <div class="fwjsHeader__inner">
      <h1 class="fwjsHeader__title" v-if="title && title.trim() !== ''">
        <span v-if="!isStandalone">
          <router-link to="/">
            {{ $t('home') }}
          </router-link>
          <span class="fwjsHeader__separator"> / </span>
        </span>
        {{ title }}
      </h1>
      <h1 class="fwjsHeader__title" @click="toTop" v-else>
        <router-link to="/">
          {{ $t('appname') }}
        </router-link>
      </h1>
      <fwjsWidget v-if="showWidget" />
      <aside class="fwjsHeader__profiles">
        <slot v-if="isLogged && !isStandalone" />
        <a
          class="fwjsHeader__logout"
          href="#"
          v-if="isStandalone"
          @click="logout"
          @keyup.enter="logout"
          @keyup.space="logout"
        >
          {{ $t('logout') }}
        </a>
      </aside>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed, ref, type Ref } from 'vue';
  import fwjsWidget from './fwjsWidget.vue';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { usePageStore } from '../store/pages';
  import { useRoute } from 'vue-router';

  const props = withDefaults(
    defineProps<{
      sticky?: boolean;
      fixed?: boolean;
    }>(),
    {
      sticky: false,
      fixed: true,
    },
  );

  const route = useRoute();

  const scrollSticky: Ref<boolean> = ref(false);

  const { isLogged } = storeToRefs(useAuthStore());
  const { title, isStandalone } = storeToRefs(usePageStore());

  const showWidget = computed(() => {
    return isLogged.value && route.path !== '/' && route.path !== 'login' && !isStandalone.value;
  });

  const toTop = () => {
    window.scrollTo(0, 0);
  };

  const logout = () => {
    useAuthStore().revokeToken();
  };
</script>

<style lang="scss">
  .fwjsHeader {
    background-color: var(--main-color);
    color: var(--main-color-text);
    height: var(--header-size);
    align-items: center;
    display: inline-flex;
    justify-content: space-between;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 999;
    box-shadow: none;
    transition: box-shadow 0.25s linear;
    > a,
    &__logout {
      color: var(--main-color-text);
      text-decoration: none;
      &:hover {
        color: var(--main-color-text);
        text-decoration: underline;
      }
    }
    &.is__fixed {
      position: fixed;
      z-index: 999;
    }
    &.is__sticky {
      position: sticky;
      top: 0;
      box-shadow: var(--shadowLevel-2);
    }
    &__inner {
      align-items: center;
      display: inline-flex;
      justify-content: space-between;
      position: relative;
      width: 100vw;
    }
    &__profiles {
      align-items: center;
      display: inline-flex;
      text-align: right;
      padding: 0 0.5rem 0 0;
    }
    &__menuToggler {
      cursor: pointer;
      margin: 0 0.5rem 0 0;
      display: block;
      padding: 0;
      position: relative;
      @media (min-width: $screen-sm-min) {
        background-color: #ca555c;
        height: var(--header-size);
        width: var(--header-size);
      }
      @media (max-width: $screen-sm-min) {
        border-right: 0px none;
        padding: 24px 8px 0 8px;
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        z-index: 2;
      }
      & + .fwjsHeader__appLogo {
        margin-left: 0;
      }
    }
    &__menuToggler__icon {
      @media (min-width: $screen-sm-min) {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      @media (max-width: $screen-sm-min) {
        filter: brightness(0);
        position: relative;
        top: -7px;
      }
    }
    &__icon {
      cursor: pointer;
      width: var(--icon-size);
      margin: 0 0.5rem;
    }
    &__iconPortal {
      @media (max-width: $screen-sm-min) {
        display: none;
      }
    }
    &__appLogo {
      margin: 0.3rem 0 0 1rem;
    }
    &__back {
      cursor: pointer;
      font-size: 1.35rem;
      padding: 1rem 1rem 0.7rem 1rem;
      background-color: var(--umu-primario-400, rgb(202, 85, 92));
      background-color: transparent;
      margin: 0 0.25rem 0 0;
      @media (max-width: 480px) {
        padding: 16px 0 15px 16px;
      }
    }
    &__title {
      color: var(--card-bg-color);
      font-size: 1.15rem;
      font-weight: 400;
      line-height: 1;
      flex-grow: 6;
      margin: 0 0 0 0;
      padding: 0 0 0 1rem;
      .fwjsHeader__back + & {
        padding: 0 0 0 0;
      }
      a {
        color: var(--card-bg-color);
        text-decoration: none;
        font-weight: 500;
        &:hover {
          color: var(--main-color-text);
        }
      }
      @media (max-width: 480px) {
        font-size: 1.1rem;
        overflow: hidden;
        padding: 0.5rem 0.5rem 0.5rem 1.1rem;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }
    }
    &__subtitle {
      flex-grow: 2;
      font-size: 16px;
      margin: 0 0 0 0;
      padding: 0 0 0 0;
      @media (max-width: $screen-sm-min) {
        display: none;
      }
    }
    &__searchToggler {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      @media (max-width: $screen-sm-min) {
        display: none;
      }
    }
  }
</style>
