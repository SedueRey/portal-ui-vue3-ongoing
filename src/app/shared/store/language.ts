import { type Ref, ref } from 'vue';
import { defineStore } from 'pinia';
import sharedApi from '../api/shared.api';
import { useI18n } from 'vue-i18n';

export const useLanguageStore = defineStore('language', () => {
  const language: Ref<string> = ref('');
  // Actions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setLanguage = (value: string): void => {
    // Ignoro los idiomas y fuerzo siempre el castellano
    // ya que no tenemos traducción para el resto de idiomas
    language.value = 'es';
    useI18n().locale.value = 'es';
  };
  const setRemoteLanguage = async (value: string): Promise<void> => {
    language.value = value;
    useI18n().locale.value = 'es';
    await sharedApi.setLanguage(value);
  };
  return {
    language,
    setLanguage,
    setRemoteLanguage,
  };
});
