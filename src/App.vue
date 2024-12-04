<template>
  <div v-if="isLoaded">
    <span class="toContentContainer">
      <VueSkipTo to="#content" label="Ir al contenido" />
      <VueSkipTo to="#myevents" label="Saltar hasta la agenda" />
      <VueSkipTo to="#carriles" label="Saltar hasta los carriles" />
    </span>
    <div>Aquí irá la cabecera -{{ isLogged }}-</div>
    <button @click="login" class="pose__button">Miau</button>
    <div>{{ $t('safariButton') }}</div>
    <div v-if="!isLogged" class="app__loading"></div>
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
  import { RouterView } from 'vue-router';
  import { jwtDecode } from 'jwt-decode';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from './app/auth/store/auth';

  const { isLogged, tokenData } = storeToRefs(useAuthStore());
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
      } else {
        useAuthStore().setToken(apptoken.value);
      }
      if (!isSafari()) {
        await login();
      } else {
        //this.$logger.warn('Accediendo mediante safari');
      }
    }
    isLoaded.value = true;
  });
</script>

<style lang="scss"></style>
