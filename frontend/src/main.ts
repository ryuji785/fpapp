// Install dependencies: npm install && npm run dev
// or: yarn install && yarn dev

import { createApp } from 'vue';
import App from './App.vue';
import { Quasar } from 'quasar';
import 'quasar/dist/quasar.css';
import '@quasar/extras/material-icons/material-icons.css';

const app = createApp(App);
app.use(Quasar, { plugins: {} });
app.mount('#app');
