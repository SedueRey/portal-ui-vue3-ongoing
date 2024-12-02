import { createI18n } from 'vue-i18n';
import { nextTick } from 'vue';

export const SUPPORT_LOCALES = ['es', 'en'];

export function setupI18n(options = { locale: 'es' }) {
  const i18n = createI18n({
    ...options,
    legacy: false,
    fallbackLocale: 'es',
    silentTranslationWarn: true,
  });
  setI18nLanguage(i18n, options.locale);
  loadLocaleMessages(i18n, options.locale);
  return i18n;
}

export function setI18nLanguage(i18n, locale) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }
  const html: HTMLHtmlElement | null = document.querySelector('html');
  if (html) {
    html.setAttribute('lang', locale);
  }
}

export async function loadLocaleMessages(i18n, locale) {
  // load locale messages with dynamic import
  const messages = await import(`./app/shared/locales/${locale}.json`);

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default);

  return nextTick();
}
