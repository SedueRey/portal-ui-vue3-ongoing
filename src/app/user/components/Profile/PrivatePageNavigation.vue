<template>
  <nav class="privatepagenavigation">
    <h1 class="privatepagenavigation__title">
      {{ title }}
    </h1>
    <slot class="privatepagenavigation__links" />
  </nav>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'PrivatePageNavigation',
    props: {
      title: { type: String, required: true },
    },
  });
</script>

<style lang="scss">
  .privatepagenavigation {
    position: fixed;
    top: var(--header-size);
    bottom: 0;
    left: 0;
    width: var(--private-menu-size);
    background-color: var(--privatebgcolor);
    @media (max-width: $screen-sm-min) {
      bottom: auto;
      right: 0;
      max-width: 100vw;
      overflow-x: auto;
      width: 100vw;
      z-index: 3;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
    }
    &__title {
      font-weight: 600;
      font-size: 0.625rem;
      padding: 0.875rem 1rem 0 1rem;
      text-transform: uppercase;
      @media (max-width: $screen-sm-min) {
        display: none;
      }
    }
    a {
      color: var(--main-text-color);
      display: block;
      text-decoration: none;
      padding: 0.875rem 1rem;
      &:hover,
      &.router-link-exact-active {
        background-color: var(--highlight-color);
        color: var(--main-color);
      }
      @media (max-width: $screen-sm-min) {
        background-color: var(--privatebgcolor);
        font-size: 0.875rem;
        text-align: center;
      }
    }
  }
</style>
