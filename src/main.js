import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import 'vant/lib/index.css'
import Vue3Transitions from 'vue3-transitions'
import vant from 'vant'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
//需引入默认样式
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import router from './router'
import { createPinia } from 'pinia'
const pinia = createPinia()
// 1. axios 基础配置
axios.defaults.baseURL = 'http://localhost:3000'

// 2. 补充请求拦截器（Vue2 里的 token 逻辑）
axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token // 携带 token 到请求头
    }
    return config
  },
  (error) => {
    // 拦截器错误处理（补充这个避免请求异常时无反馈）
    return Promise.reject(error)
  }
)

// 3. 创建并配置应用实例
const app = createApp(App)
app.use(Vue3Transitions)
app.use(Vue3DraggableResizable)
app.use(vant)
app.use(pinia)
app.use(router)
app.use(ElementPlus) // 挂载 Element Plus
app.config.globalProperties.$axios = axios // 全局挂载 axios（命名为 $axios）
app.mount('#app') // 挂载到 DOM
