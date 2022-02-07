import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@themesberg/flowbite'

import App from './App.vue'
import router from './routes'
import './index.css'

// 解决 tailwind 样式覆盖
const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
