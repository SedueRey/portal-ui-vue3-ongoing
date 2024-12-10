<template>
  <div v-if="isLoaded">
    <span class="toContentContainer">
      <VueSkipTo to="#content" label="Ir al contenido" />
      <VueSkipTo to="#myevents" label="Saltar hasta la agenda" />
      <VueSkipTo to="#carriles" label="Saltar hasta los carriles" />
    </span>
    <fwjs-header fixed>
      <fwjs-notifications v-if="isLogged" />
      <fwjsUserProfile :should-render-children="isAdmin" v-if="isLogged">
        <admin-links v-if="isAdmin" />
      </fwjsUserProfile>
    </fwjs-header>
    <Button @click="login" label="Miau" />
    <div>{{ $t('safariButton') }}</div>
    <div v-if="!isLogged" class="app__loading">
      <div v-if="isSafari()">
        <h1>{{ $t('safariTitle') }}</h1>
        <fwjs-message v-if="loginError && loginError.code !== 200" category="danger">
          <p>
            {{ $t('error423') }}
          </p>
          Error: <strong>{{ loginError.code }}</strong
          ><br />
          <code>{{ loginError.info }}</code>
        </fwjs-message>
        <p>
          {{ $t('safariText') }}
          <a href="https://www.um.es/web/atica/micampus" target="_blank">
            {{ $t('safariLink') }}
          </a>
        </p>
        <button @click="login" class="pose__button">
          {{ $t('safariButton') }}
        </button>
        <p class="light">
          {{ $t('safariCau1') }}
          (<a href="tel:868884222">868 88 4222</a>)
          {{ $t('safariCau2') }}
          <a href="mailto:dumbo@um.es" rel="noopener" target="_blank"> dumbo@um.es. </a>
        </p>
      </div>
      <div class="app_pulse" v-else></div>
    </div>
    <main class="app_inner" v-cloak>
      <div class="app_view" id="app_view">
        <!-- router -->
        <div id="content">
          <router-view />
        </div>
        <!-- end router -->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { type Ref, onBeforeMount, ref } from 'vue';
  import AdminLinks from './app/auth/components/AdminLinks.vue';
  import { Button } from 'primevue';
  import { RouterView } from 'vue-router';
  import fwjsHeader from './app/shared/components/fwjsHeader.vue';
  import fwjsMessage from './app/shared/components/fwjsMessage.vue';
  import fwjsNotifications from './app/shared/components/fwjsNotifications.vue';
  import fwjsUserProfile from './app/user/components/fwjsUserProfile.vue';
  import { jwtDecode } from 'jwt-decode';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from './app/auth/store/auth';

  const { isLogged, tokenData, isAdmin, loginError } = storeToRefs(useAuthStore());
  const apptoken: Ref<string | null | undefined> = ref(null);
  const isLoaded: Ref<boolean> = ref(false);
  const isSafari = () => {
    return window._env_.isSafari || false;
  };

  const login = async () => {
    const hash = window.location.hash.replace('#/', '').replace('//', '/') || '';
    if (hash !== '' && hash !== 'login/') {
      sessionStorage.setItem('POSE_LOGIN_ROUTE_KEY', hash);
    }
    if (!tokenData.value && hash !== 'login/') {
      await useAuthStore().login();
    } else if (tokenData.value) {
      if (isSafari()) {
        // this.$logger.warn('Completado acceso mediante Safari');
      }
    }
  };

  onBeforeMount(async () => {
    apptoken.value = sessionStorage.getItem('accesstoken');
    if (apptoken.value) {
      const tokenData = jwtDecode(apptoken.value);
      const validTimestamp = tokenData.exp ? tokenData.exp * 1000 : 0;
      if (Date.now() > validTimestamp) {
        sessionStorage.removeItem('accesstoken');
        apptoken.value = null;
        await login();
      } else {
        useAuthStore().setToken(apptoken.value);
      }
    } else {
      await login();
    }
    isLoaded.value = true;
  });
</script>

<style lang="scss">
  @import '@/app/shared/assets/_cssvars.scss';
  @import '@/app/shared/assets/_common.scss';

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  html,
  body {
    background: var(--main-bg-color);
    margin: 0;
    padding: 0;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: var(--font-size);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--main-text-color);
    text-rendering: optimizelegibility;
    @media (max-width: $screen-sm-min) {
      overflow-x: hidden;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--header-font-family);
  }

  a {
    color: var(--link-color);
  }

  body.body_opened_menu {
    @media (max-width: $screen-lg-desktop) {
      max-height: 100vh;
      overflow-y: hidden;
    }
  }

  body.disable-overflow {
    max-height: 100vh;
    overflow-y: hidden;
    .completeList__container {
      filter: blur(2px);
    }
  }

  #app {
    padding-top: var(--header-size);
    min-height: 100vh;
  }

  .app_inner {
    min-height: calc(100vh - 8rem);
    width: 100%;
  }

  .app__loading {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    > div {
      max-width: 80%;
      @media (min-width: $screen-sm-min) {
        max-width: 50%;
      }
    }
    .light {
      font-weight: 300;
      font-size: 0.875rem;
    }
    button.pose__button {
      font-size: 1rem;
      margin: 1rem 0;
      padding: 0.85rem 1.25rem;
    }
  }

  .app_view {
    transition: margin 0.25s linear;
    margin-left: 0;
  }

  .app__menu_isOpened {
    .app_view {
      margin-left: 280px;
      @media (max-width: $screen-lg-desktop) {
        margin-left: 0;
        flex-grow: 2;
      }
    }
  }

  .toContentContainer .vue-skip-to {
    margin: 0;
    z-index: 9999;
    &.focused {
      border: 0px none;
      outline: unset;
    }
    .vue-skip-to__link {
      font-size: 1rem;
      padding: 0.9rem 1rem;
      &:focus {
        color: var(--main-color-text);
        background-color: var(--main-color);
        outline: initial;
        border: 1px solid var(--main-color-text);
      }
    }
  }

  ::-webkit-scrollbar {
    width: 10px;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 100px;
  }
  ::-webkit-scrollbar:hover {
    background-color: rgba(0, 0, 0, 0.09);
  }
  ::-webkit-scrollbar-thumb:vertical {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 100px;
    background-clip: padding-box;
    border: 2px solid rgba(0, 0, 0, 0);
    min-height: 10px;
  }
  ::-webkit-scrollbar-thumb:vertical:active {
    background: rgba(0, 0, 0, 0.61);
    border-radius: 100px;
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.09);
  }

  .app_pulse {
    background: url('/img/loader.svg') no-repeat center center;
    background-size: 88%;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
    margin: 0.5rem;
    height: 6.5rem;
    width: 6.5rem;
    transform: perspective(500px) scale3d(1, 1, 1);
    transform-origin: 50% 50% 50%;
    filter: saturate(70%);
    animation: pulse-otd 2s infinite;
  }

  .pose__button {
    appearance: none;
    background-color: var(--main-color);
    border-radius: var(--card-border-radius);
    border: 1px solid var(--main-color);
    box-sizing: content-box;
    color: var(--main-bg-color);
    cursor: pointer;
    display: inline-block;
    line-height: 1;
    padding: 0.65rem 1rem;
    margin: 0 0.5rem 1rem 0;
    text-align: center;
    text-decoration: none;
    user-select: none;
    white-space: nowrap;
    @media (max-width: $screen-xs) {
      display: block;
    }
    &:hover {
      background-color: #d77f85;
      border-color: #d77f85;
    }

    &[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
      filter: grayscale(100);
    }

    &.btn-sm {
      font-size: 0.875rem;
      padding: 0.5rem 0.5rem;
    }

    &.no-margin {
      margin: 0;
    }

    &.width-card {
      width: 10rem;
    }

    &.right {
      float: right;
    }

    &.button__secondary {
      color: var(--main-color);
      background: transparent;
      &:hover {
        background-color: var(--highlight-color);
        border-color: var(--main-color);
      }
    }

    &.button__third {
      color: #666666;
      background: #ebeff1;
      border-color: #ebeff1;
      &:hover {
        background-color: #dee3e6;
        border-color: #dee3e6;
      }
    }
  }

  .breadcrumbs {
    color: #767676;
    font-size: 0.75rem;
    list-style: none;
    margin: 0;
    padding: 0;
    &__item {
      display: inline-block;
      &:not(:last-child)::after {
        content: '/';
        color: var(--main-color);
        display: inline-block;
        padding: 0 0.25rem;
      }
    }
    a {
      color: var(--main-text-header);
      text-decoration: none;
      &:hover {
        font-weight: 600;
        text-decoration: underline;
        text-decoration-color: var(--main-color);
      }
    }
  }

  .mayusculas {
    text-transform: uppercase;
  }

  .panel {
    @media (min-width: $screen-sm-min) {
      box-shadow: var(--shadowLevel-2);
    }
    border-radius: var(--card-border-radius);
    .panel-space {
      padding: 1rem 1.5rem;
    }
    .panel-top {
      border-top-left-radius: var(--card-border-radius);
      border-top-right-radius: var(--card-border-radius);
    }
    .panel-bottom {
      border-bottom-left-radius: var(--card-border-radius);
      border-bottom-right-radius: var(--card-border-radius);
    }
    .panel-dark {
      background: var(--privatebgcolor);
    }
    .panel-compact {
      padding: 0 1rem;
    }
    .panel-bottom-bordered {
      padding-bottom: 1rem;
      border-bottom: 1px solid #d8dde1;
    }
    .panel-columns {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      @media (max-width: $screen-sm-min) {
        flex-direction: column;
      }
      > p {
        padding-right: 0.45rem;
        flex-shrink: 1;
        line-height: 1.5;
        &:not(last-child) {
          @media (min-width: $screen-sm-min) {
            margin-right: 1.5rem;
          }
        }
        a {
          color: var(--main-color);
        }
      }
    }
  }

  .right {
    text-align: right;
  }

  @keyframes pulse-otd {
    0% {
      transform: perspective(500px) scale3d(0.92, 0.92, 1);
      box-shadow: 0 0 0 0 rgba(189, 42, 51, 0.7);
    }

    70% {
      transform: scale3d(1, 1, 1);
      box-shadow: 0 0 0 10px rgba(189, 42, 51, 0);
    }

    100% {
      transform: perspective(500px) scale3d(0.92, 0.92, 1);
      box-shadow: 0 0 0 0 rgba(189, 42, 51, 0);
    }
  }
</style>
