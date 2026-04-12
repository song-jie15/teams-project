<template>
  <header class="sticky-header">
    <!-- 头部左侧：菜单折叠按钮和页面标题 -->
    <div class="header-left">
      <button class="menu-toggle" @click="handleToggleSidebar">
        <span class="icon">☰</span>
      </button>
      <span class="page-title">{{ t('personalCenter') }}</span>
    </div>

    <!-- 头部右侧：功能按钮区域 -->
    <div class="header-right">
      <!-- 1. 主题切换功能 -->
      <div class="theme-switcher">
        <!-- 明暗主题切换 -->
        <button
          class="header-btn"
          @click="toggleDarkMode"
          :title="isDarkMode ? t('switchToLight') : t('switchToDark')"
        >
          <span class="icon">{{ isDarkMode ? '🌞' : '🌙' }}</span>
        </button>
        
        <!-- 主题色切换功能：仅管理员可见 -->
        <div v-if="userInfo.role === 'admin'" class="theme-color-switcher">
          <button
            class="header-btn"
            @click="toggleTheme"
            :title="t('switchTheme')"
          >
            <span class="icon">🎨</span>
          </button>
          <!-- 主题色选择面板 -->
          <div v-if="showThemePanel" class="theme-panel">
            <div class="theme-title">{{ t('selectTheme') }}</div>
            <div class="theme-colors">
              <button
                v-for="color in themeColors"
                :key="color.value"
                class="theme-color-btn"
                :style="{ backgroundColor: color.value }"
                :class="{ active: currentTheme === color.value }"
                @click="changeTheme(color.value)"
                :title="color.name"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 搜索功能 -->
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="t('searchPlaceholder')"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <span class="icon">🔍</span>
        </button>
      </div>

      <!-- 3. 语言切换功能 -->
      <div class="language-switcher">
        <button
          class="header-btn"
          @click="toggleLanguage"
          :title="t('switchLanguage')"
        >
          <span class="icon">🌐</span>
          <span class="lang-text">{{
            currentLanguage === 'zh' ? '中' : 'EN'
          }}</span>
        </button>
      </div>

      <!-- 4. 全屏切换功能 -->
      <button
        class="header-btn"
        @click="toggleFullscreen"
        :title="t('fullscreen')"
      >
        <span class="icon">⛶</span>
      </button>

      <!-- 5. 消息通知功能 -->
      <div class="notification-wrapper">
        <button
          class="header-btn"
          @click="toggleNotification"
          :title="t('notification')"
        >
          <span class="icon">🔔</span>
          <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </button>
        <!-- 消息通知下拉面板 -->
        <div v-if="showNotification" class="notification-panel">
          <div class="notification-header">
            <span>{{ t('notification') }}</span>
            <button @click="markAllRead">{{ t('markAllRead') }}</button>
          </div>
          <div class="notification-list">
            <div
              v-for="(msg, index) in notifications"
              :key="index"
              class="notification-item"
            >
              {{ msg }}
            </div>
          </div>
        </div>
      </div>

      <!-- 6. 用户头像及退出登录功能 -->
      <div class="user-dropdown">
        <button class="user-avatar-btn" @click="toggleUserMenu">
          <img
            :src="userInfo.avatarUrl || defaultAvatar"
            :alt="userInfo.name"
            class="avatar-img"
          />
          <span class="user-name">{{ userInfo.name }}</span>
          <span class="dropdown-icon">▼</span>
        </button>
        <!-- 用户下拉菜单 -->
        <div v-if="showUserMenu" class="user-menu">
          <div class="user-menu-header">
            <img
              :src="userInfo.avatarUrl || defaultAvatar"
              :alt="userInfo.name"
              class="menu-avatar-img"
            />
            <div class="user-menu-info">
              <div class="menu-user-name">{{ userInfo.name }}</div>
              <div class="menu-user-role">
                {{ userInfo.role === 'admin' ? t('admin') : t('user') }}
              </div>
            </div>
          </div>
          <div class="user-menu-divider"></div>
          <a href="#" class="user-menu-item">
            <span class="menu-item-icon">👤</span>
            <span>{{ t('profile') }}</span>
          </a>
          <a href="#" class="user-menu-item">
            <span class="menu-item-icon">⚙️</span>
            <span>{{ t('settings') }}</span>
          </a>
          <a href="#" class="user-menu-item" @click.prevent="navigateToExcel">
            <span class="menu-item-icon">📊</span>
            <span>{{ t('excelImportExport') }}</span>
          </a>
          <div class="user-menu-divider"></div>
          <button class="user-menu-item logout" @click="handleLogout">
            <span class="menu-item-icon">🚪</span>
            <span>{{ t('logout') }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import instance from '../../utiles/request'

// ==================== 路由实例 ====================
const router = useRouter()

// ==================== 定义 props ====================
const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({
      name: 'Admin',
      avatar: 'A',
      avatarUrl: '',
      role: 'admin'
    })
  }
})

// ==================== 定义 emits ====================
const emit = defineEmits(['toggleSidebar'])

// ==================== 默认头像 ====================
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'

// ==================== 搜索功能 ====================
// 搜索关键词
const searchQuery = ref('')

// ==================== 语言切换功能 ====================
// 当前语言：'zh' 中文，'en' 英文
const currentLanguage = ref('zh')

// 翻译字典
const translations = {
  zh: {
    personalCenter: '个人中心',
    admin: '管理员',
    user: '用户',
    searchPlaceholder: '搜索...',
    switchLanguage: '切换语言',
    fullscreen: '全屏',
    notification: '消息通知',
    markAllRead: '全部已读',
    profile: '个人资料',
    settings: '系统设置',
    excelImportExport: 'Excel导入导出',
    logout: '退出登录',
    switchTheme: '切换主题',
    selectTheme: '选择主题色',
    switchToDark: '切换到暗色模式',
    switchToLight: '切换到亮色模式',
    DataKe:'数据'
  },
  en: {
    personalCenter: 'Personal Center',
    admin: 'Administrator',
    user: 'User',
    searchPlaceholder: 'Search...',
    switchLanguage: 'Switch Language',
    fullscreen: 'Fullscreen',
    notification: 'Notifications',
    markAllRead: 'Mark all as read',
    profile: 'Profile',
    settings: 'Settings',
    excelImportExport: 'Excel Import Export',
    logout: 'Logout',
    switchTheme: 'Switch Theme',
    selectTheme: 'Select Theme Color',
    switchToDark: 'Switch to Dark Mode',
    switchToLight: 'Switch to Light Mode',
  }
}

// 翻译函数
const t = (key) => {
  return translations[currentLanguage.value][key] || key
}

// ==================== 主题切换功能 ====================
// 是否显示主题面板
const showThemePanel = ref(false)
// 当前主题色
const currentTheme = ref('#3498db')
// 是否为暗色模式
const isDarkMode = ref(false)

// 可选主题色列表
const themeColors = [
  { name: '默认蓝', value: '#3498db' },    
  { name: '活力红', value: '#e74c3c' },
  { name: '清新绿', value: '#2ecc71' },
  { name: '优雅紫', value: '#9b59b6' },
  { name: '温暖橙', value: '#f39c12' },
  { name: '深邃青', value: '#1abc9c' }
]

// ==================== 消息通知功能 ====================
// 是否显示通知面板
const showNotification = ref(false)
// 未读消息数量
const unreadCount = ref(3)
// 消息列表
const notifications = ref([
  '您有一条新的系统消息',
  '用户张三提交了申请',
  '文章审核通过'
])

// ==================== 用户菜单功能 ====================
// 是否显示用户下拉菜单
const showUserMenu = ref(false)

// ==================== 方法定义 ====================

/**
 * 处理侧边栏折叠/展开
 */
const handleToggleSidebar = () => {
  emit('toggleSidebar')
}

/**
 * 处理搜索功能
 * 当用户点击搜索按钮或按回车键时触发
 */
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索关键词:', searchQuery.value)
    // 这里可以添加实际的搜索逻辑
    alert(`搜索: ${searchQuery.value}`)
  }
}

/**
 * 切换语言
 * 在中英文之间切换
 */
const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'zh' ? 'en' : 'zh'
  // 将语言设置保存到本地存储
  localStorage.setItem('language', currentLanguage.value)
}

/**
 * 切换全屏模式
 */
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

/**
 * 切换主题面板显示状态
 */
const toggleTheme = () => {
  showThemePanel.value = !showThemePanel.value
}

/**
 * 更改主题色
 * @param {string} color - 主题色值
 */
const changeTheme = (color) => {
  currentTheme.value = color
   // 设置全局 CSS 变量
  document.documentElement.style.setProperty('--primary-color', color)
  localStorage.setItem('themeColor', color)
  showThemePanel.value = false
}

/**
 * 切换暗色模式
 */
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  // 切换 HTML 元素的类
  document.documentElement.classList.toggle('dark-mode', isDarkMode.value)
  // 保存到本地存储
  localStorage.setItem('isDarkMode', isDarkMode.value)
}

/**
 * 初始化主题设置
 */
const initTheme = () => {
  // 从本地存储读取主题色设置
  const savedTheme = localStorage.getItem('themeColor')
  if (savedTheme) {
    currentTheme.value = savedTheme
    document.documentElement.style.setProperty('--primary-color', savedTheme)
  }

  // 从本地存储读取暗色模式设置
  const savedDarkMode = localStorage.getItem('isDarkMode')
  if (savedDarkMode !== null) {
    isDarkMode.value = savedDarkMode === 'true'
    document.documentElement.classList.toggle('dark-mode', isDarkMode.value)
  }
}

/**
 * 切换通知面板显示状态
 */
const toggleNotification = () => {
  showNotification.value = !showNotification.value
  // 关闭其他面板
  showUserMenu.value = false
  showThemePanel.value = false
}

/**
 * 标记所有消息为已读
 */
const markAllRead = () => {
  unreadCount.value = 0
  notifications.value = []
}

/**
 * 切换用户菜单显示状态
 */
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  // 关闭其他面板
  showNotification.value = false
  showThemePanel.value = false
}

/**
 * 跳转到 Excel 导入导出页面
 */
const navigateToExcel = () => {
  router.push('/excel')
  // 关闭用户菜单
  showUserMenu.value = false
}

/**
 * 处理退出登录
 * 清除用户信息并跳转到登录页面
 */
const handleLogout = async () => {
  try {
    // 调用退出登录接口
    await instance.post('/logout')
  } catch (error) {
    console.log('退出登录接口调用失败')
  }

  // 清除本地存储的 token
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')

  // 跳转到登录页面
  console.log('退出登录，跳转到登录页面')
  router.replace('/about')

  // 强制刷新页面，确保路由守卫重新执行
  window.location.reload()
}

// ==================== 生命周期钩子 ====================
// onMounted(() => {
//   // 从本地存储读取语言设置
//   const savedLanguage = localStorage.getItem('language')
//   if (savedLanguage) {
//     currentLanguage.value = savedLanguage
//   }
  // 初始化主题设置
  initTheme()

  // 从本地存储读取主题色设置
  const savedTheme = localStorage.getItem('themeColor')
  if (savedTheme) {
    currentTheme.value = savedTheme
    document.documentElement.style.setProperty('--primary-color', savedTheme)
  }

  // 点击外部关闭下拉面板
  document.addEventListener('click', (e) => {
    const target = e.target
    if (!target.closest('.user-dropdown')) {
      showUserMenu.value = false
    }
    if (!target.closest('.notification-wrapper')) {
      showNotification.value = false
    }
    if (!target.closest('.theme-switcher')) {
      showThemePanel.value = false
    }
  })

</script>

<style lang="scss">
// ==================== 头部导航栏样式 ====================
.sticky-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: var(--header-bg, #ffffff);
  border-bottom: 1px solid var(--border-color, #e2e8f0);
  box-shadow: var(--shadow, 0 1px 3px rgba(0, 0, 0, 0.1));
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  transition: all 0.3s ease;
}

// 头部左侧：菜单折叠按钮和页面标题
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;

  .menu-toggle {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: var(--text-primary, #1e293b);
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  .page-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary, #1e293b);
  }
}

// 头部右侧：功能按钮区域
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

// 通用头部按钮样式
.header-btn {
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--text-secondary, #64748b);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--text-primary, #1e293b);
  }
}

// 搜索框样式
.search-box {
  position: relative;
  margin: 0 10px;

  input {
    width: 240px;
    padding: 8px 36px 8px 12px;
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 20px;
    font-size: 0.875rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color, #3498db);
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }
  }

  .search-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 0.875rem;
    color: var(--text-secondary, #64748b);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      color: var(--primary-color, #3498db);
    }
  }
}

// 语言切换器
.language-switcher {
  .lang-text {
    font-size: 0.875rem;
    font-weight: 500;
  }
}

// 消息通知
.notification-wrapper {
  position: relative;

  .badge {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #ef4444;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }

  .notification-panel {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    width: 320px;
    background-color: var(--header-bg, #ffffff);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 1000;

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color, #e2e8f0);

      span {
        font-weight: 600;
        color: var(--text-primary, #1e293b);
      }

      button {
        background: none;
        border: none;
        font-size: 0.875rem;
        color: var(--primary-color, #3498db);
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
          background-color: rgba(52, 152, 219, 0.1);
        }
      }
    }

    .notification-list {
      max-height: 300px;
      overflow-y: auto;

      .notification-item {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-color, #e2e8f0);
        color: var(--text-primary, #1e293b);
        font-size: 0.875rem;

        &:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
      }
    }
  }
}

// 主题色切换
.theme-switcher {
  position: relative;

  .theme-panel {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    width: 200px;
    background-color: var(--header-bg, #ffffff);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 12px;
    z-index: 1000;

    .theme-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary, #1e293b);
      margin-bottom: 12px;
    }

    .theme-colors {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;

      .theme-color-btn {
        width: 40px;
        height: 40px;
        border: 2px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.1);
        }

        &.active {
          border-color: var(--text-primary, #1e293b);
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}

// 用户下拉菜单
.user-dropdown {
  position: relative;

  .user-avatar-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: var(--text-primary, #1e293b);
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .avatar-img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .dropdown-icon {
      font-size: 0.75rem;
      transition: transform 0.3s ease;
    }
  }

  .user-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    width: 200px;
    background-color: var(--header-bg, #ffffff);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 1000;

    .user-menu-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid var(--border-color, #e2e8f0);

      .menu-avatar-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }

      .user-menu-info {
        .menu-user-name {
          font-weight: 600;
          color: var(--text-primary, #1e293b);
          font-size: 0.875rem;
        }

        .menu-user-role {
          font-size: 0.75rem;
          color: var(--text-secondary, #64748b);
          margin-top: 2px;
        }
      }
    }

    .user-menu-divider {
      height: 1px;
      background-color: var(--border-color, #e2e8f0);
    }

    .user-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: var(--text-primary, #1e293b);
      text-decoration: none;
      font-size: 0.875rem;
      transition: all 0.3s ease;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &.logout {
        color: #ef4444;

        &:hover {
          background-color: rgba(239, 68, 68, 0.1);
        }
      }

      .menu-item-icon {
        font-size: 1rem;
      }
    }
  }
}

// ==================== 暗色模式样式 ====================
.dark-mode {
  .sticky-header {
    background-color: var(--header-bg, #1f2937);
    border-bottom-color: var(--border-color, #374151);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .header-btn {
    color: var(--text-secondary, #9ca3af);

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--text-primary, #f3f4f6);
    }
  }

  .search-box input {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: var(--border-color, #374151);
    color: var(--text-primary, #f3f4f6);

    &::placeholder {
      color: var(--text-secondary, #9ca3af);
    }

    &:focus {
      border-color: var(--primary-color, #3498db);
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }
  }

  .search-btn {
    color: var(--text-secondary, #9ca3af);

    &:hover {
      color: var(--primary-color, #3498db);
    }
  }

  .notification-panel,
  .theme-panel,
  .user-menu {
    background-color: var(--header-bg, #1f2937);
    border-color: var(--border-color, #374151);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .notification-header span,
  .theme-title,
  .menu-user-name {
    color: var(--text-primary, #f3f4f6);
  }

  .notification-item {
    color: var(--text-primary, #f3f4f6);

    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .user-avatar-btn {
    color: var(--text-primary, #f3f4f6);

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .user-menu-item {
    color: var(--text-primary, #f3f4f6);

    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }

    &.logout {
      color: #ef4444;

      &:hover {
        background-color: rgba(239, 68, 68, 0.1);
      }
    }
  }

  .menu-user-role {
    color: var(--text-secondary, #9ca3af);
  }
}


// ==================== 响应式设计 ====================
@media (max-width: 768px) {
  .sticky-header {
    padding: 0 12px;
  }

  .search-box input {
    width: 180px;
  }

  .user-dropdown .user-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .search-box {
    display: none;
  }

  .header-left .page-title {
    font-size: 1rem;
  }
}
</style>
