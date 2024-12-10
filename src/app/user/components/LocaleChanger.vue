<template>
  <label for="tal" class="localeChanger">
    <select id="tal" class="localeChanger__select" v-model="$i18n.locale" @change="setLanguage">
      <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">
        {{ langNames[lang] }}
      </option>
    </select>
    <span class="localeChanger__text">Selecciona idioma / Choose your language</span>
  </label>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useLanguageStore } from '@/app/shared/store/language';

  const { language } = storeToRefs(useLanguageStore());

  const langs = ref(['es', 'en']);
  const langNames = ref({
    es: 'Español',
    en: 'English',
  });

  const setLanguage = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    useLanguageStore().setLanguage(target.value);
    useLanguageStore().setRemoteLanguage(target.value);
  };

  onMounted(() => {
    useLanguageStore().setLanguage(language.value);
  });
</script>

<style lang="scss" scoped>
  .localeChanger {
    display: block;
    overflow: hidden;
    position: relative;

    &__select {
      background: #ffffff url('/img/icons/world.svg') no-repeat;
      background-position: 0.8rem 50%;
      border: 0px none;
      border-top: 1px solid #d8dde1;
      border-bottom: 1px solid #d8dde1;
      color: rgba(0, 0, 0, 0.54);
      cursor: pointer;
      font-family: var(--font-family);
      font-size: 1rem;
      font-weight: 450;
      padding: 0.875rem 1rem 0.875rem 3rem;
      width: 100%;
    }

    &__text {
      position: absolute;
      top: -10rem;
      left: -10rem;
    }
  }
</style>
