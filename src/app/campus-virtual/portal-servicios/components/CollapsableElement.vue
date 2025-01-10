<template>
  <article class="collapsable">
    <span
      class="collapsable__icon"
      @click="toggleCollapsable"
      @keyup.enter="toggleCollapsable"
      @keyup.space="toggleCollapsable"
      tabindex="0"
    >
      <span v-if="!collapsedItem">&minus;</span>
      <span v-else>&plus;</span>
    </span>
    <h1
      class="collapsable__title"
      @click="toggleCollapsable"
      @keyup.enter="toggleCollapsable"
      @keyup.space="toggleCollapsable"
    >
      {{ title }}
    </h1>
    <div class="collapsable__content" v-if="!collapsedItem">
      <slot />
    </div>
  </article>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'CollapsableElement',
    props: {
      title: { type: String, required: true },
      collapsed: { type: Boolean, required: false, default: false },
    },
    data() {
      return {
        collapsedItem: this.collapsed,
      };
    },
    methods: {
      toggleCollapsable() {
        this.collapsedItem = !this.collapsedItem;
      },
    },
  });
</script>

<style lang="scss" scoped>
  .collapsable {
    &__icon {
      cursor: pointer;
      float: right;
      font-size: 2rem;
      font-weight: 300;
      margin: -0.5rem 0 0 0;
      user-select: none;
      @media (max-width: $screen-sm-min) {
        margin: -0.9rem 0 0 0;
      }
    }
    &__title {
      cursor: pointer;
      font-size: 1.25rem;
      font-weight: 500;
      margin: 0 0 1rem 0;
      padding: 0 0 0 0;
    }
  }
</style>
