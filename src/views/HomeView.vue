<template>
  <div class="home-container">
    <!-- 左侧菜单栏：Sidebar 组件 -->
    <Siderbar :user-info="userInfo" @toggle-sidebar="handleToggleSidebar" />

    <!-- 右侧主内容区域 -->
    <div class="main-container">
      <!-- 头部导航栏：Navbar 组件 -->
      <Navbar :user-info="userInfo" @toggle-sidebar="handleToggleSidebar" />

      <!-- 页面内容 -->
      <div class="content-area">
        <h1>欢迎来到主页面！</h1>
        <p>这是登录后的首页</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Siderbar from '../components/layout/siderbar/index.vue'
import Navbar from '../components/layout/Navbar.vue'

// ==================== 用户信息 ====================
// 存储当前登录用户的信息，包括头像、姓名、角色等
const userInfo = ref({
  name: 'Admin',
  avatar: 'A',
  avatarUrl: '',
  role: 'admin', // 'admin' 或 'user'
  permissions: []
})

// ==================== 侧边栏状态 ====================
const sidebarOpen = ref(false)

// ==================== 方法定义 ====================

/**
 * 处理侧边栏折叠/展开
 */
const handleToggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  const sidebar = document.querySelector('.sidebar')
  if (sidebar) {
    sidebar.classList.toggle('collapsed')
  }
}

/**
 * 从本地存储加载用户信息
 */
const loadUserInfo = () => {
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    try {
      const parsedUserInfo = JSON.parse(storedUserInfo)
      console.log('从本地存储加载的用户信息:', parsedUserInfo)
      userInfo.value = {
        ...userInfo.value,
        name: parsedUserInfo.username || userInfo.value.name,
        avatar: parsedUserInfo.username?.charAt(0)?.toUpperCase() || 'A',
        permissions: parsedUserInfo.permissions || [],
        role: parsedUserInfo.roles?.[0]?.name || 'user'
      }
      console.log('更新后的用户信息:', userInfo.value)
    } catch (error) {
      console.error('解析用户信息失败:', error)
    }
  }
}

// ==================== 生命周期钩子 ====================
onMounted(() => {
  // 加载用户信息
  loadUserInfo()
})
</script>

<style scoped>
.home-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

p {
  font-size: 1.125rem;
  color: #64748b;
}
</style>
