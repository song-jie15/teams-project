<template>
  <aside class="sidebar">
    <!-- 侧边栏头部：Logo区域 -->
    <div class="sidebar-header">
      <div class="logo">🔥</div>
      <div class="logo-text">Sunday</div>
    </div>

    <!-- 侧边栏菜单导航 -->
    <nav class="sidebar-menu">
      <!-- 个人中心 -->
      <div class="menu-item">
        <a
          href="#"
          class="menu-link active"
          @click.prevent="handleMenuClick('personalCenter')"
        >
          <span class="menu-icon">👤</span>
          <span class="menu-text">{{ t('personalCenter') }}</span>
        </a>
      </div>

      <!-- 用户管理：只有皇上和太监会显示 -->
      <div v-if="hasPermission('01')" class="menu-item has-dropdown">
        <a href="#" class="menu-link" @click.prevent="toggleDropdown($event)">
          <span class="menu-icon">👥</span>
          <span class="menu-text">{{ t('user') }}</span>
          <span class="dropdown-arrow"></span>
        </a>
        <div class="sub-menu">
          <!-- 用户列表：皇上和太监会显示 -->
          <div v-if="hasPermission('01')" class="sub-menu-item">
            <a
              href="#"
              class="menu-link"
              @click.prevent="handleMenuClick('userList')"
              >{{ t('userList') }}</a
            >
          </div>
          <!-- 添加用户：只有皇上会显示 -->
          <div v-if="hasPermission('02')" class="sub-menu-item">
            <a
              href="#"
              class="menu-link"
              @click.prevent="handleMenuClick('addUser')"
              >{{ t('addUser') }}</a
            >
          </div>
        </div>
      </div>

      <!-- 文章管理：所有人都会显示 -->
      <div class="menu-item has-dropdown">
        <a href="#" class="menu-link" @click.prevent="toggleDropdown($event)">
          <span class="menu-icon">📄</span>
          <span class="menu-text">{{ t('article') }}</span>
          <span class="dropdown-arrow"></span>
        </a>
        <div class="sub-menu">
          <!-- 文章列表：所有人都会显示 -->
          <div v-if="hasPermission('03')" class="sub-menu-item">
            <a
              href="#"
              class="menu-link"
              @click.prevent="handleMenuClick('articleList')"
              >{{ t('articleList') }}</a
            >
          </div>
          <!-- 发布文章：所有人都会显示 -->
          <div v-if="hasPermission('04')" class="sub-menu-item">
            <a
              href="#"
              class="menu-link"
              @click.prevent="handleMenuClick('publishArticle')"
              >{{ t('publishArticle') }}</a
            >
          </div>
        </div>
      </div>
      <!-- 数据可视化 -->
      <div v-if="hasPermission('01')" class="menu-item" >
        <a href="#" class="menu-link" @click.prevent="handleMenuClick('datalist')">
          <span class="menu-icon">📊</span>
          <span class="menu-text">{{ t('DataKe') }}</span>
        </a>
      </div>
    </nav>

    <!-- 侧边栏底部：用户信息 -->
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">{{ userInfo.avatar || 'U' }}</div>
        <div class="user-details">
          <div class="user-name">{{ userInfo.name || t('user') }}</div>
          <div class="user-role">
            {{ userInfo.role === 'admin' ? t('admin') : t('user') }}
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// ==================== 定义 props ====================
const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({
      name: 'Admin',
      avatar: 'A',
      role: 'admin',
      permissions: []
    })
  }
})

// ==================== 权限检查 ====================
/**
 * 检查用户是否有指定的权限
 * @param {string} permissionCode - 权限代码
 * @returns {boolean} 是否有该权限
 */
const hasPermission = (permissionCode) => {
  // 从用户信息中获取权限列表
  const permissions = props.userInfo.permissions || []
  // 检查是否有匹配的权限
  return permissions.some((p) => p.code === permissionCode)
}

// ==================== 定义 emits ====================
const emit = defineEmits(['toggleSidebar', 'menuClick'])

// ==================== 语言切换功能 ====================
// 当前语言：'zh' 中文，'en' 英文
const currentLanguage = ref('zh')

// 翻译字典
const translations = {
  zh: {
    personalCenter: '个人中心',
    user: '用户',
    userList: '用户列表',
    addUser: '添加用户',
    article: '文章',
    articleList: '文章列表',
    publishArticle: '发布文章',
    admin: '管理员',
    user: '用户',
    DataKe: '数据可视化'
  },
  en: {
    personalCenter: 'Personal Center',
    user: 'User',
    userList: 'User List',
    addUser: 'Add User',
    article: 'Article',
    articleList: 'Article List',
    publishArticle: 'Publish Article',
    admin: 'Administrator',
    user: 'User',
    DataKe: 'Data Visualization'
  }
}

// 翻译函数
const t = (key) => {
  return translations[currentLanguage.value][key] || key
}

// ==================== 菜单交互 ====================
/**
 * 切换下拉菜单的展开/折叠状态
 * @param {Event} event - 点击事件对象
 */
const toggleDropdown = (event) => {
  const link = event.currentTarget
  const subMenu = link.nextElementSibling
  if (subMenu) {
    link.classList.toggle('active')
    subMenu.classList.toggle('open')
  }
}

/**
 * 处理菜单项点击事件
 * @param {string} menuKey - 菜单项的唯一标识
 */
const handleMenuClick = (menuKey) => {
  console.log('菜单点击:', menuKey)
  emit('menuClick', menuKey)
}

// ==================== 生命周期钩子 ====================
onMounted(() => {
  // 从本地存储读取语言设置
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    currentLanguage.value = savedLanguage
  }
})
console.log('当前权限：', props.userInfo.permissions)
console.log('userInfo:', props.userInfo)
console.log('permissions:', props.userInfo.permissions)



</script>

<style lang="scss" scoped>
// ==================== 侧边栏样式 ====================
.sidebar {
  width: 240px;
  min-height: 100vh;
  background-color: #1e293b;
  border-right: 2px solid #ef4444;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  // 折叠状态
  &.collapsed {
    width: 80px;

    .logo-text,
    .menu-text,
    .user-details {
      display: none;
    }

    .menu-icon {
      margin-right: 0;
    }

    .user-avatar {
      margin: 0 auto;
    }
  }

  // 侧边栏头部：Logo区域
  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .logo {
      width: 32px;
      height: 32px;
      background-color: #ef4444;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.25rem;
    }

    .logo-text {
      color: white;
      font-size: 1.25rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
  }

  // 侧边栏菜单导航
  .sidebar-menu {
    flex: 1;
    padding: 1rem 0;

    .menu-item {
      position: relative;

      &.has-dropdown {
        .menu-link {
          justify-content: space-between;

          .dropdown-arrow {
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid rgba(255, 255, 255, 0.7);
            transition: transform 0.3s ease;
          }

          &.active .dropdown-arrow {
            transform: rotate(180deg);
          }
        }

        .sub-menu {
          padding-left: 1.5rem;
          background-color: rgba(255, 255, 255, 0.05);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;

          &.open {
            max-height: 200px;
          }

          .sub-menu-item {
            .menu-link {
              padding: 0.75rem 1.5rem;
              font-size: 0.875rem;
              color: rgba(255, 255, 255, 0.7);

              &:hover {
                background-color: rgba(255, 255, 255, 0.1);
              }

              &.active {
                color: white;
                background-color: rgba(239, 68, 68, 0.2);
                border-left: 3px solid #ef4444;
              }
            }
          }
        }
      }

      .menu-link {
        display: flex;
        align-items: center;
        padding: 1rem 1.5rem;
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        transition: all 0.3s ease;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }

        &.active {
          color: white;
          background-color: rgba(239, 68, 68, 0.2);
          border-left: 3px solid #ef4444;
        }

        .menu-icon {
          margin-right: 0.75rem;
          font-size: 1.125rem;
          transition: all 0.3s ease;
        }

        .menu-text {
          font-size: 0.9375rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
      }
    }
  }

  // 侧边栏底部：用户信息
  .sidebar-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.3s ease;

      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .user-details {
        transition: all 0.3s ease;

        .user-name {
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .user-role {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
        }
      }
    }
  }
}

// ==================== 响应式设计 ====================
@media (max-width: 768px) {
  .sidebar {
    width: 200px;

    .sidebar-header {
      padding: 1.25rem;

      .logo-text {
        font-size: 1.125rem;
      }
    }

    .sidebar-menu {
      .menu-item {
        .menu-link {
          padding: 0.875rem 1.25rem;

          .menu-text {
            font-size: 0.875rem;
          }
        }
      }
    }

    .sidebar-footer {
      padding: 0.875rem 1.25rem;
    }
  }
}
</style>
