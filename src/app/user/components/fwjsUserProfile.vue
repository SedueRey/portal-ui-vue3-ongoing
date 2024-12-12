<template>
  <pre>opened: {{ opened }}</pre>
  <aside class="fwjsUserProfile" v-if="loaded">
    <div
      v-if="isLogged"
      @click.prevent="toggle()"
      @keyup.enter="toggle()"
      @keyup.space="toggle()"
      tabindex="0"
      class="fwjsUserProfile__outerUserPicture"
      :class="opened ? 'is-active' : ''"
    >
      <span class="fwjsUserProfile__userPicture">
        <img
          v-if="imgURL"
          :src="imgURL"
          :alt="userCompleteName"
          class="fwjsUserProfile__userAuthImage"
        />
      </span>
    </div>
    <span class="fwjsUserProfile__triangle" v-if="opened" />
    <span class="fwjsUserProfile__bg" v-if="opened" @click="hide()" />
    <div
      ref="profileMenu"
      class="fwjsUserProfile__menu"
      :class="classMenu"
      style="display: none"
      v-if="user"
    >
      <div class="fwjsUserProfile__menuitem is-compact" @click="hide()">
        <span @click="hide" class="fwjsUserProfile__menunative">
          <FwjsUserData :user="user" :url-photo="imgURL" />
        </span>
      </div>
      <LocaleChanger v-if="false" />
      <nav class="fwjsUserProfile__itemsContainer" v-if="hasDefaultSlot && shouldRenderChildren">
        <div class="fwjsUserProfile__items" @click="hide()">
          <slot />
        </div>
      </nav>
      <router-link
        to="/profile/data"
        class="fwjsUserProfile__menuitem fwjsUserProfile__menuProfile"
        :class="classMenu"
      >
        <span @click="hide()" class="fwjsUserProfile__menunative">
          <i class="fal fa-user-circle" /> {{ $t('profile') }}
        </span>
      </router-link>
      <router-link
        to="/preferences"
        class="fwjsUserProfile__menuitem fwjsUserProfile__menuPreferences"
        @click="hide()"
      >
        <span @click="hide()" class="fwjsUserProfile__menunative">
          <i class="fal fa-cog" /> {{ $t('preferences') }}
        </span>
      </router-link>
      <div
        class="fwjsUserProfile__menuitem"
        @click="logout()"
        @keyup.enter="logout()"
        @keyup.space="logout()"
        tabindex="0"
      >
        <i class="fal fa-power-off" /> {{ $t('logout') }}
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, type Ref, useTemplateRef } from 'vue';
  import FwjsUserData from './fwjsUserData.vue';
  import LocaleChanger from './LocaleChanger.vue';
  import { onClickOutside } from '@vueuse/core';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { useNotificationsStore } from '@/app/shared/store/notifications';
  import userApi from '../api/user.api';
  import { useUserStore } from '../store/user';

  const props = defineProps({
    shouldRenderChildren: { type: Boolean, default: true },
  });

  const authStore = useAuthStore();
  const { isLogged, token } = storeToRefs(authStore);
  const { user } = storeToRefs(useUserStore());

  const opened: Ref<boolean> = ref(false);
  const loaded: Ref<boolean> = ref(false);
  const profileMenu = useTemplateRef('profileMenu');
  const imgURL: Ref<string | undefined> = ref(undefined);

  onClickOutside(profileMenu, () => hide());

  const userCompleteName = computed(() => {
    if (!user.value) {
      return '';
    }
    const { nombre, apellido1, apellido2 } = user.value.afiliacion;
    return `${nombre} ${apellido1} ${apellido2}`;
  });

  const urlPhoto = computed(() => {
    const urls = userApi.endpoints();
    return `${urls.environmentURL}${urls.userPhoto}`;
  });

  const hasDefaultSlot = computed(() => false /* !!useSlots().default */);
  const classMenu = computed(() =>
    hasDefaultSlot.value && props.shouldRenderChildren ? '' : 'has_noMenu',
  );

  const toggle = () => {
    console.log('toggle');
    opened.value = !opened.value;
    if (profileMenu.value) {
      profileMenu.value.style.display = opened.value ? 'flex' : 'none';
    }
  };

  const hide = () => {
    opened.value = false;
    if (profileMenu.value) {
      profileMenu.value.style.display = 'none';
    }
  };

  const logout = () => {
    if (isLogged.value) {
      hide();
      authStore.revokeToken();
    }
    loaded.value = false;
  };

  const getUserData = async () => {
    if (isLogged.value) {
      await useUserStore().setUser();
      await useNotificationsStore().getNotifications();
      loaded.value = true;
    }
  };

  onMounted(async () => {
    opened.value = false;
    await getUserData();
    if (token.value) {
      fetch(urlPhoto.value, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
        .then((resp) => resp.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            const base64data = reader.result;
            imgURL.value = base64data as string;
          };
        });
    }
  });
</script>

<style lang="scss">
  .fwjsUserProfile {
    margin: 0 0.5rem;
    user-select: none;

    &__bg {
      display: none;
      @media (max-width: $screen-sm-min) {
        background: rgba(0, 0, 0, 0.2);
        bottom: 0;
        display: block;
        height: 100vh;
        left: 0;
        position: fixed;
        right: 0;
        top: var(--header-size);
      }
    }

    &__outerUserPicture {
      padding: 0.25rem;
      background: transparent;
      border-radius: 0.25rem;

      &.is-active {
        background: rgba(255, 255, 255, 0.25);
      }
    }

    &__triangle {
      content: '';
      display: block;
      position: absolute;
      background-color: var(--main-bg-color);
      height: 16px;
      width: 16px;
      right: 23px;
      transform: rotate(45deg);
      z-index: 1;
      margin-top: 0.25rem;
    }

    &__userPicture {
      background-color: transparent;
      border-radius: var(--icon-size);
      cursor: pointer;
      display: block;
      height: var(--icon-size);
      overflow: hidden;
      width: var(--icon-size);

      img {
        height: auto;
        width: var(--icon-size);
      }
    }

    &__menu {
      background: #fff;
      box-shadow: var(--shadowLevel-3);
      color: var(--main-text-color);
      position: fixed;
      right: 0;
      bottom: 0;
      text-align: left;
      top: var(--header-size);
      width: 29rem;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-items: stretch;

      &.has_noMenu {
        bottom: auto;
      }

      @media (max-width: $screen-sm-min) {
        bottom: 0;
        width: 100vw;
      }
    }

    &__menunative {
      display: block;
    }

    &__itemsContainer {
      flex-grow: 2;
      position: relative;
      max-height: calc(100vh - var(--header-size));
    }

    &__items {
      left: 0;
      max-height: 100%;
      overflow-y: auto;
      padding: 0;
      position: absolute;
      right: 0;
      top: 0;
    }

    &__menuitem {
      background: var(--main-bg-color);
      border-top: 1px solid #d8dde1;
      color: #555;
      cursor: pointer;
      display: block;
      padding: 1rem;
      text-decoration: none;

      i {
        margin: 0 1rem 0 0;
      }

      &.is-compact {
        border-top: 0 none;
        padding: 0;
      }

      &.is-small {
        font-size: 0.875rem;
      }

      &.has_noMenu {
        border-top: 0 none;
      }

      &:hover {
        background: var(--main-bg-color-dark);
      }
    }
  }
</style>
