import { type Ref, ref } from 'vue';
import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';

export const usePageStore = defineStore('pages', () => {
  const title: Ref<string> = ref('');
  const isPublic: Ref<boolean> = ref(false);
  const isStandalone: Ref<boolean> = ref(false);
  // Mutaciones
  const setPublic = (value: boolean): void => {
    isPublic.value = value;
  };
  const setStandalone = (value: boolean): void => {
    isStandalone.value = value;
  };
  const setTitle = (value: string): void => {
    const { locale } = useI18n();
    const defaultTitle =
      locale.value === 'en'
        ? 'University of Murcia Service site'
        : 'Portal de Servicios de la Universidad de Murcia';
    title.value = value;
    document.title = `${title.value.trim() !== '' ? `${title.value} - ` : ''}${defaultTitle}`;
  };
  return {
    title,
    isPublic,
    isStandalone,
    // Mutaciones
    setPublic,
    setStandalone,
    setTitle,
  };
});
