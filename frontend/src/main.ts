// Install dependencies: npm install && npm run dev
// or: yarn install && yarn dev

import { createApp } from 'vue';
import App from './App.vue';
import { Quasar } from 'quasar';
import 'quasar/src/css/index.sass';
import '@quasar/extras/material-icons/material-icons.css';
import router from './router';
import 'golden-layout/dist/css/goldenlayout-base.css';
import 'golden-layout/dist/css/themes/goldenlayout-light-theme.css';

const app = createApp(App);
app.use(router);
app.use(Quasar, {});
app.mount('#app');
