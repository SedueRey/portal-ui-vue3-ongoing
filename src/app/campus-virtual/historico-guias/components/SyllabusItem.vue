<template>
  <div class="syllabusitem">
    <router-link class="syllabusitem__link" :to="url"> {{ id }} - {{ name }} </router-link>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    id: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
  });

  const url = computed(() => {
    return `/historico/guiadocente/guia/${props.type}/${props.id}`;
  });
</script>

<style lang="scss">
  .syllabusitem {
    font-size: 0.9rem;
    padding: 0.5rem 0.5rem 1rem 1.5rem;
    &__link {
      display: block;
      padding: 0;
      &:hover {
        text-decoration: none;
      }
    }
  }
</style>
