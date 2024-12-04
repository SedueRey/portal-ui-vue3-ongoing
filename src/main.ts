import '@vue-a11y/skip-to/dist/style.css';
import App from './App.vue';
import VueSkipTo from '@vue-a11y/skip-to';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import { setupI18n } from './i18n';

const app = createApp(App);
const i18n = await setupI18n();

app.use(createPinia());
app.use(router);
app.use(VueSkipTo);
app.use(i18n);

app.mount('#app');
