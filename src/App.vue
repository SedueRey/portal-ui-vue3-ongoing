<script setup lang="ts">
  import { type Ref, ref } from 'vue';
  import Button from 'primevue/button';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a: Ref<any> = ref(false);
</script>

<template>
  {{ a }}
  <Button />
</template>

<style lang="scss"></style>
