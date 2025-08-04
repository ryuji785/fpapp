// Install dependencies: npm install && npm run dev
// or: yarn install && yarn dev

import { createApp } from 'vue';
import App from './App.vue';
import { Quasar } from 'quasar';
import 'quasar/src/css/index.sass';
import '@quasar/extras/material-icons/material-icons.css';

createApp(App).use(Quasar, {}).mount('#app');
