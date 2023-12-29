import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import { Toast } from 'vant'
import 'vant/es/toast/style'

import './assets/css/public.css'
import './assets/css/border-1px.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Toast)
app.mount('#app')
