<template>
  <div class="notifications" ref="notificationsRef" v-if="isLogged && validRoute">
    <div class="notifications__outerIcon" :class="showed ? 'is-active' : ''">
      <img
        class="notifications__icon"
        :alt="$t('showNots')"
        src="/img/icons/bell_iconfinder.svg"
        @click="toggle"
        @keyup.enter="toggle"
        @keyup.space="toggle"
        tabindex="0"
      />
    </div>
    <span class="notifications__summary" v-if="summary" @click="toggle">
      {{ summary }}
    </span>
    <span class="notifications__triangle" v-if="showed" />
    <ul class="notifications__menu" v-if="showed">
      <li class="notifications__categoryItem" v-if="unread.length > 0">
        <span class="notifications__markAllAsRead" @click="markAllAsRead">
          {{ $t('markAllRead') }}
        </span>
      </li>
      <li class="notifications__categoryItem" v-else>
        <span class="notifications__nonots">
          {{ $t('noNots') }}
        </span>
      </li>
      <li class="notifications__categoryItem" v-for="(item, j) in group" :key="j">
        <h3 class="notifications__groupTitle">{{ j }} ({{ groupItems(j).length }})</h3>
        <ul class="notifications__submenu">
          <li v-for="(data, i) in groupItems(j)" :key="i" class="notifications__menuItem">
            <fwjs-notification-item :notification="data" :id="cardId(data.codigo_alerta)" />
            <span class="notifications__markAsRead" @click="markAsRead(data.codigo_alerta)">
              {{ $t('markRead') }}
            </span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, useTemplateRef } from 'vue';
  import fwjsNotificationItem from './fwjsNotificationItem.vue';
  import groupBy from '../utils/groupBy';
  import { onClickOutside } from '@vueuse/core';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { useNotificationsStore } from '../store/notifications';
  import { useRoute } from 'vue-router';

  const { isLogged } = storeToRefs(useAuthStore());
  const { notifications } = storeToRefs(useNotificationsStore());

  const route = useRoute();

  const showed = ref(false);

  const summary = computed(() => (notifications.value.length > 0 ? notifications.value.length : 0));
  const unread = computed(() => (notifications.value.length > 0 ? notifications.value : []));
  const group = computed(() =>
    notifications.value.length > 0 ? groupBy(unread.value, 'aplicacion') : [],
  );
  const validRoute = computed(() => route.path === '/');

  const toggle = () => {
    showed.value = !showed.value;
  };

  const hide = () => {
    showed.value = false;
  };

  const notificationsRef = useTemplateRef('notificationsRef');
  onClickOutside(notificationsRef, () => hide());

  const markAsRead = (itemId) => {
    useNotificationsStore().markNotificationAsRead(itemId);
  };

  const markAllAsRead = () => {
    const nots = notifications.value.map((el) => el.codigo_alerta);
    useNotificationsStore().markAllNotificationAsRead(nots);
  };

  const groupItems = (key) => {
    return group.value[key];
  };

  const cardId = (id) => {
    return id ? `${id}` : '';
  };
</script>

<style lang="scss" scoped>
  .notifications {
    user-select: none;
    position: relative;
    top: 2px;
    &__outerIcon {
      padding: 0.25rem 0;
      background: transparent;
      border-radius: 0.25rem;
      &.is-active {
        background: rgba(255, 255, 255, 0.25);
      }
    }
    &__icon {
      cursor: pointer;
      margin: 0 0.5rem;
      width: var(--icon-size);
      &:hover {
        filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.35));
      }
    }
    &__summary {
      background-color: var(--title-color);
      border-radius: 2px;
      bottom: 0;
      color: var(--title-inverse-color);
      cursor: pointer;
      display: block;
      font-size: 0.8rem;
      line-height: 1;
      min-width: 16px;
      padding: 2px 0;
      position: absolute;
      right: 0;
      text-align: center;
    }
    &__triangle {
      content: '';
      display: block;
      position: absolute;
      top: 34px;
      background-color: var(--main-bg-color);
      height: 16px;
      width: 16px;
      right: 11px;
      transform: rotate(45deg);
    }
    &__menu {
      background-color: var(--main-bg-color);
      box-shadow: 0px 8px 8px 0px rgba(0, 0, 0, 0.15);
      color: var(--main-text-color);
      line-height: 1;
      list-style-type: none;
      margin: 0 0 0 0;
      max-height: calc(100vh - 40px);
      overflow-y: auto;
      padding: 0 0 0 0;
      position: absolute;
      right: -48px;
      text-align: left;
      top: 40px;
      width: var(--menu-size);
      @media (max-width: $screen-sm-min) {
        border: 1px solid rgba(0, 0, 0, 0.25);
        box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.25);
        top: 29px;
        border-radius: 2px;
        max-height: calc(100vh - 63px);
        overflow: auto;
        right: 0;
      }
    }
    &__submenu {
      list-style: none;
      margin: 0 0 0 0;
      padding: 0 0 1rem 0;
    }
    &__menuItem {
      font-size: 0.875rem;
      padding: 0.875rem 0.875rem 1.5rem 0.875rem;
      border-bottom: 1px solid var(--border-color);
      position: relative;
    }
    &__groupTitle {
      border-bottom: 1px solid var(--border-color);
      font-size: 1rem;
      margin: 0 0 0 0;
      padding: 0.75rem 1rem 0.75rem 1rem;
    }
    &__markAsRead {
      color: var(--link-color);
      cursor: pointer;
      display: block;
      padding: 0.5rem 0;
      text-decoration: underline;
      position: absolute;
      text-align: right;
      bottom: 0.05rem;
      right: 1rem;
      &:hover {
        text-decoration: none;
      }
    }
    &__markAllAsRead {
      border-bottom: 1px solid var(--border-color);
      color: var(--link-color);
      cursor: pointer;
      display: block;
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
      text-decoration: underline;
    }
    &__nonots {
      display: block;
      font-size: 0.9rem;
      padding: 1.5rem 1rem;
    }
  }
</style>
