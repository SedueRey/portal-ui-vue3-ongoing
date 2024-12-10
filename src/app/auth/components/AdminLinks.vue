<template>
  <section class="adminLinks" v-if="isAdmin">
    <div class="adminLinks__menuitem no-click">
      {{ $t('apiumTitle') }}<br />
      <button class="pose__button button__secondary" v-if="!isLoadingComplete" @click="incremental">
        <i v-if="isLoading" class="fal fa-spinner fa-pulse" />
        {{ $t('incremental') }}
      </button>
      <button class="pose__button button__secondary" v-if="!isLoadingIncremental" @click="total">
        <i v-if="isLoading" class="fal fa-spinner fa-pulse" />
        {{ $t('total') }}
      </button>
    </div>
  </section>
</template>
<script lang="ts" setup>
  import apiumApi from '../api/apium.api';
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '../store/auth';

  const { isAdmin } = storeToRefs(useAuthStore());

  const isLoading = ref(false);
  const isLoadingComplete = ref(false);
  const isLoadingIncremental = ref(false);

  const incremental = async () => {
    isLoading.value = true;
    isLoadingIncremental.value = true;
    await apiumApi.incrementalapium();
    isLoading.value = false;
    isLoadingIncremental.value = false;
  };

  const total = async () => {
    isLoading.value = true;
    isLoadingIncremental.value = true;
    await apiumApi.totalapium();
    isLoading.value = false;
    isLoadingIncremental.value = false;
  };
</script>

<style lang="scss">
  .adminLinks {
    &__menuitem {
      background: var(--main-bg-color);
      border-bottom: 1px solid #d8dde1;
      color: #555;
      cursor: pointer;
      display: block;
      padding: 1rem;
      text-decoration: none;
      &.no-click {
        cursor: inherit;
      }
    }
    .pose__button {
      margin: 0.75rem 0.5rem 0.25rem 0;
    }
  }
</style>
