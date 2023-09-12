import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue'; // Reemplaza 'App' con el nombre real de tu componente principal
import router from './router'; // Asegúrate de importar correctamente tu enrutador

const app = createApp(App);
app.use(router); // Usa el enrutador
app.mount('#app');
