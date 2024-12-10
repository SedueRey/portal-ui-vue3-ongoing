<template>
  <article v-if="text !== ''" class="alert alert__info" v-html="text" />
  <article v-else :class="getClass">
    <slot />
  </article>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'fwjsMessage',
    computed: {
      getClass() {
        return `alert alert__${this.category}`;
      },
    },
    props: {
      text: { type: String, required: false, default: '' },
      category: { type: String, default: 'info' },
    },
  });
</script>

<style lang="scss">
  .alert {
    text-align: left;
    line-height: 1.35;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    &__success {
      color: var(--message-color-success);
      background-color: var(--message-success);
    }
    &__info {
      color: var(--message-color-info);
      background-color: var(--message-info);
    }
    &__warning {
      color: var(--message-color-warning);
      background-color: var(--message-warning);
    }
    &__danger {
      color: var(--message-color-error);
      background-color: var(--message-error);
    }
  }
</style>
