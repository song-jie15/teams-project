<template>
  <main class="app-main">
    <!-- 内容头部 -->
    <div class="content-header">
      <h1>{{ t('welcome') }} Sunday {{ t('system') }}</h1>
      <p>{{ t('workbench') }}</p>
    </div>

    <!-- 内容主体 -->
    <div class="content-body">
      <p>{{ t('sidebarApplied') }}</p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// ==================== 语言切换功能 ====================
// 当前语言：'zh' 中文，'en' 英文
const currentLanguage = ref('zh')

// 翻译字典
const translations = {
  zh: {
    welcome: '欢迎使用',
    system: '系统',
    workbench: '这是您的个人工作台',
    sidebarApplied: '侧边栏样式已成功应用'
  },
  en: {
    welcome: 'Welcome to',
    system: 'System',
    workbench: 'This is your personal workbench',
    sidebarApplied: 'Sidebar style has been successfully applied'
  }
}

// 翻译函数
const t = (key) => {
  return translations[currentLanguage.value][key] || key
}

// ==================== 生命周期钩子 ====================
onMounted(() => {
  // 从本地存储读取语言设置
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    currentLanguage.value = savedLanguage
  }
})
</script>

<style lang="scss" scoped>
// ==================== 主内容区域样式 ====================
.app-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: var(--content-bg, #f8fafc);
}

// ==================== 内容头部样式 ====================
.content-header {
  margin-bottom: 2rem;

  h1 {
    font-size: 1.875rem;
    font-weight: 600;
    color: var(--text-primary, #1e293b);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary, #64748b);
    font-size: 1rem;
  }
}

// ==================== 内容主体样式 ====================
.content-body {
  background-color: var(--header-bg, #ffffff);
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow, 0 1px 3px rgba(0, 0, 0, 0.1));
  border: 1px solid var(--border-color, #e2e8f0);

  p {
    color: var(--text-primary, #1e293b);
    font-size: 1rem;
  }
}
</style>
