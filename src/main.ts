import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@vue-a11y/skip-to/dist/style.css';
import App from './App.vue';
import BadgeDirective from 'primevue/badgedirective';
import ConfirmationService from 'primevue/confirmationservice';
import PrimeVue from 'primevue/config';
import Ripple from 'primevue/ripple';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import VueSkipTo from '@vue-a11y/skip-to';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import { setupI18n } from './i18n';

import { upPreset } from './app/mc.primevue4.preset';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueSkipTo);
// Adaptado a PrimeVue V4
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: upPreset,
    options: {
      darkModeSelector: 'mc-dark',
    },
  },
});

app.use(ConfirmationService);
app.use(ToastService);
app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);

setupI18n().then((i18n) => {
  app.use(i18n);
  app.mount('#app');
});
