import { createWebHistory, createRouter } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: 'datalist',
        name: 'datalist',
        component: () => import('../views/chart/DatalistView.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 简化的路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 首先检查是否是登录页面
  if (to.path === '/login') {
    // 登录页面始终允许访问
    next()
    return
  }
  // 检查是否是404页面
  if (to.name === 'NotFound') {
    // 404页面始终允许访问
    next()
    return
  }
  // 其他页面需要验证token
  if (token) {
    next()
  } else {
    // 未登录跳转到登录页
    next('/login')
  }
})

export default router
