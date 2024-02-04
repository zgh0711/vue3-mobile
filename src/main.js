import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import 'vant/es/toast/style'
// import 'vant/es/dialog/style'
// import 'vant/es/image-preview/style'
import './assets/css/border-1px.css'
import './assets/css/common.css'
import './assets/css/public.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
