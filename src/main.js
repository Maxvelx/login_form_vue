import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";

axios.defaults.baseURL = 'https://api.test.maxvel.pp.ua/'

const app = createApp(App)

app.use(router)

app.mount('#app')
