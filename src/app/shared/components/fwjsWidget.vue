<template>
  <aside class="fwjswidget">
    <span
      ref="fwjswidgetToggler"
      class="fwjswidget__toggler"
      @click="toggleWidget"
      @keyup.enter="toggleWidget"
      @keyup.space="toggleWidget"
      tabindex="0"
    >
      <span class="fwjswidget__outer" :class="isOpened ? 'is-active' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24">
          <path
            fill="#FFF"
            fill-opacity=".8"
            fill-rule="evenodd"
            d="M14.222 4.222c0 1.222-1 2.222-2.222 2.222s-2.222-1-2.222-2.222S10.778 2 12 2s2.222
          1 2.222 2.222zM4.222 2C3 2 2 3 2 4.222s1 2.222 2.222 2.222 2.222-1 2.222-2.222S5.444 2
          4.222 2zm15.556 4.444C21 6.444 22 5.444 22 4.222S21 2 19.778 2s-2.222 1-2.222 2.222 1
          2.222 2.222 2.222zM12 17.556c-1.222 0-2.222 1-2.222 2.222S10.778 22 12 22s2.222-1
          2.222-2.222-1-2.222-2.222-2.222zm-7.778 0C3 17.556 2 18.556 2 19.778S3 22 4.222
          22s2.222-1 2.222-2.222-1-2.222-2.222-2.222zm15.556 0c-1.222 0-2.222 1-2.222 2.222s1 2.222
          2.222 2.222S22 21 22 19.778s-1-2.222-2.222-2.222zM12 9.778c-1.222 0-2.222 1-2.222 2.222s1
          2.222 2.222 2.222 2.222-1 2.222-2.222-1-2.222-2.222-2.222zm-7.778 0C3 9.778 2 10.778 2
          12s1 2.222 2.222 2.222 2.222-1 2.222-2.222-1-2.222-2.222-2.222zm15.556 0c-1.222 0-2.222
          1-2.222 2.222s1 2.222 2.222 2.222S22 13.222 22 12s-1-2.222-2.222-2.222z"
          />
        </svg>
      </span>
    </span>
    <nav class="fwjswidget__menu" v-if="isOpened">
      <div id="fwjswidget__load_holder" v-if="services">
        <div class="fwjswidget__items">
          <fwjs-widget-item v-for="service in services" :key="service.id" :service="service" />
        </div>
        <a href="/" class="fwjswidget__item_portal">
          <span class="fwjswidget__item__toCampus">Ir a Mi campus</span>
        </a>
      </div>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
  import { onMounted, ref, type Ref } from 'vue';
  import fwjsWidgetItem from './fwjsWidgetItem.vue';
  import { onClickOutside } from '@vueuse/core';
  import sharedApi from '../api/shared.api';
  import type { WidgetService } from '../shared.types';

  const isOpened = ref(false);
  const services: Ref<WidgetService[]> = ref([]);
  const fwjswidgetToggler = ref(null);

  const toggleWidget = () => {
    isOpened.value = isOpened.value;
  };
  onClickOutside(fwjswidgetToggler, () => (isOpened.value = false));

  onMounted(async () => {
    await sharedApi.widget().then((response) => {
      services.value = response.data;
    });
  });
</script>

<style lang="scss">
  .fwjswidget {
    font-family: 'Inter', sans-serif;
    margin: 0.4rem 0.5rem 0 0;
    padding: 0 0.5rem;
    font-size: 0.9em;
    @media (min-width: $screen-sm-min) {
      position: relative;
    }
    &__outer {
      padding: 0.25rem 0.35rem;
      background: transparent;
      border-radius: 0.25rem;
      box-sizing: border-box;
      display: block;
      overflow: hidden;
      position: relative;
      width: 2.5rem;
      height: 2.5rem;
      top: -0.2rem;
      svg {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: 0 0 0 1px;
        transform: translate(-50%, -50%);
      }
      &.is-active {
        background: rgba(255, 255, 255, 0.25);
      }
    }
    &__toggler {
      cursor: pointer;
    }
    &__menu {
      background: #fff;
      box-shadow: 0 3px 9px 0 rgba(0, 0, 0, 0.5);
      margin-left: 0;
      margin-top: 6px;
      width: 100vw;
      padding: 0;
      position: absolute;
      right: 0;
      z-index: 9999;
      @media (min-width: $screen-sm-min) {
        width: 22.5rem;
        max-width: 100vw;
        overflow-x: hidden;
      }
    }
    &__items {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      padding: 0.5rem 0;
    }
    &__item_portal {
      background-color: #f2f5f7;
      color: #212121;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      padding: 1rem;
      margin: 0 0 0 0;
      text-decoration: none;
      svg {
        margin: 0 1.2rem 0 0;
      }
    }
  }
</style>
