<template>
  <main class="app-main">
    <!-- 内容头部 -->
    <div class="content-header" v-if="currentMenu !== 'datalist'">
      <h1>{{ getPageTitle() }}</h1>
      <p>{{ getPageDescription() }}</p>
    </div>

    <!-- 内容主体 -->
    <div class="content-body">
      <!-- 个人中心 -->
      <div v-if="currentMenu === 'personalCenter'" class="page-content">
        <div class="welcome-card">
          <h2>个人中心</h2>
          <p>欢迎回来，这里是您的个人中心页面。</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-value">12</span>
              <span class="stat-label">文章</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">8</span>
              <span class="stat-label">评论</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">24</span>
              <span class="stat-label">收藏</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户列表 -->
      <div v-else-if="currentMenu === 'userList'" class="page-content">
        <div class="table-container">
          <h2>用户列表</h2>
          <p class="drag-hint">提示：可以拖拽用户行进行排序</p>
          <table class="data-table">
            <thead>
              <tr>
                <th>排序</th>
                <th>ID</th>
                <th>用户名</th>
                <th>角色</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(user, index) in userlist"
                :key="user.id"
                draggable="true"
                @dragstart="handleDragStart($event, index)"
                @dragover="handleDragOver($event)"
                @dragleave="handleDragLeave($event)"
                @drop="handleDrop($event, index)"
                class="draggable-row"
              >
                <td class="drag-handle">☰</td>
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <button class="btn btn-edit">编辑</button>
                  <button class="btn btn-delete">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 添加用户 -->
      <div v-else-if="currentMenu === 'addUser'" class="page-content">
        <div class="form-container">
          <h2>添加用户</h2>
          <form class="user-form">
            <div class="form-group">
              <label>用户名</label>
              <input type="text" placeholder="请输入用户名" />
            </div>
            <div class="form-group">
              <label>密码</label>
              <input type="password" placeholder="请输入密码" />
            </div>
            <div class="form-group">
              <label>角色</label>
              <select>
                <option value="admin">管理员</option>
                <option value="user">用户</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">提交</button>
          </form>
        </div>
      </div>

      <!-- 文章列表 -->
      <div v-else-if="currentMenu === 'articleList'" class="page-content">
        <div class="table-container">
          <h2>文章列表</h2>
          <p class="drag-hint">提示：可以拖拽文章行进行排序</p>
          <table class="data-table">
            <thead>
              <tr>
                <th>排序</th>
                <th>ID</th>
                <th>标题</th>
                <th>作者</th>
                <th>发布时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(article, index) in articles"
                :key="article.id"
                draggable="true"
                @dragstart="handleArticleDragStart($event, index)"
                @dragover="handleDragOver($event)"
                @dragleave="handleDragLeave($event)"
                @drop="handleArticleDrop($event, index)"
                class="draggable-row"
              >
                <td class="drag-handle">☰</td>
                <td>{{ article.id }}</td>
                <td>{{ article.title }}</td>
                <td>{{ article.zuozhe || article.author }}</td>
                <td>{{ formatDate(article.date) }}</td>
                <td>
                  <button class="btn btn-edit">编辑</button>
                  <button class="btn btn-delete">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 发布文章 -->
      <div v-else-if="currentMenu === 'publishArticle'" class="page-content">
        <div class="form-container">
          <h2>发布文章</h2>
          <form class="article-form">
            <div class="form-group">
              <label>标题</label>
              <input type="text" placeholder="请输入文章标题" />
            </div>
            <div class="form-group">
              <label>内容</label>
              <textarea placeholder="请输入文章内容"></textarea>
            </div>
            <div class="form-group">
              <label>分类</label>
              <select>
                <option value="tech">技术</option>
                <option value="life">生活</option>
                <option value="work">工作</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">发布</button>
          </form>
        </div>
      </div>
      <!-- 数据可视化 -->
        <div v-else-if="currentMenu === 'datalist'" class="page-content"> 
          <chart></chart>
        </div>
    </div>
  </main>
</template>

<script setup>
import axios from '../../utiles/request'
import { ref, onMounted } from 'vue'
import chart from '../../views/chart/DatalistView.vue'

// ==================== 定义 props ====================
const props = defineProps({
  currentMenu: {
    type: String,
    default: 'personalCenter'
  }
})

// ==================== 语言切换功能 ====================
// 当前语言：'zh' 中文，'en' 英文
const currentLanguage = ref('zh')

// 翻译字典
const translations = {
  zh: {
    welcome: '欢迎使用',
    system: '系统',
    workbench: '这是您的个人工作台',
    sidebarApplied: '侧边栏样式已成功应用',
    personalCenter: '个人中心',
    userList: '用户列表',
    addUser: '添加用户',
    articleList: '文章列表',
    publishArticle: '发布文章'
  },
  en: {
    welcome: 'Welcome to',
    system: 'System',
    workbench: 'This is your personal workbench',
    sidebarApplied: 'Sidebar style has been successfully applied',
    personalCenter: 'Personal Center',
    userList: 'User List',
    addUser: 'Add User',
    articleList: 'Article List',
    publishArticle: 'Publish Article'
  }
}

// 翻译函数
const t = (key) => {
  return translations[currentLanguage.value][key] || key
}

// 时间格式化函数
const formatDate = (date) => {
  if (!date) return ''

  // 处理时间戳（秒或毫秒）
  let timestamp = date
  if (typeof date === 'string') {
    // 尝试解析字符串为时间戳
    if (!isNaN(date)) {
      timestamp = parseInt(date)
      // 检查是否为秒级时间戳（10位）
      if (timestamp.toString().length === 10) {
        timestamp *= 1000
      }
    } else {
      // 尝试直接解析日期字符串
      timestamp = new Date(date).getTime()
    }
  }

  // 创建日期对象
  const d = new Date(timestamp)

  // 检查日期是否有效
  if (isNaN(d.getTime())) return ''

  // 格式化日期
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// ==================== 模拟数据 ====================
// 用户数据
const userlist = ref([])
//拉取用户数据
const getUserlist = async () => {
  const res = await axios.post('http://localhost:3000/userlist')
  userlist.value = res.data
  console.log('获取后端用户数据', res.data)
}
//拉取文章数据
const getArticallist = async () => {
  const res = await axios.post('http://localhost:3000/articlelist')
  articles.value = res.data
  console.log('获取后端文章数据', res.data)
}
//调用函数
onMounted(() => {
  getUserlist()
  getArticallist()
})
// 文章数据
const articles = ref([
  { id: 1, title: 'Vue 3 入门教程', author: 'huangshang', date: '2026-04-01' },
  {
    id: 2,
    title: 'JavaScript 高级技巧',
    author: 'taijian',
    date: '2026-04-02'
  },
  { id: 3, title: 'CSS 布局指南', author: 'pingmin', date: '2026-04-03' }
])

// ==================== 拖拽相关 ====================
// 拖拽的起始索引
const dragStartIndex = ref(null)
const dragStartArticleIndex = ref(null)

/**
 * 处理用户列表拖拽开始事件
 * @param {Event} event - 拖拽事件
 * @param {number} index - 拖拽项的索引
 */
const handleDragStart = (event, index) => {
  dragStartIndex.value = index
  event.target.classList.add('dragging')
}

/**
 * 处理文章列表拖拽开始事件
 * @param {Event} event - 拖拽事件
 * @param {number} index - 拖拽项的索引
 */
const handleArticleDragStart = (event, index) => {
  dragStartArticleIndex.value = index
  event.target.classList.add('dragging')
}

/**
 * 处理拖拽经过事件
 * @param {Event} event - 拖拽事件
 */
const handleDragOver = (event) => {
  event.preventDefault() // 阻止默认行为，允许放置
  // 确保只给tr元素添加drag-over样式
  const target = event.target.closest('tr')
  if (target) {
    target.classList.add('drag-over')
  }
}

/**
 * 处理拖拽离开事件
 * @param {Event} event - 拖拽事件
 */
const handleDragLeave = (event) => {
  // 确保只移除tr元素的drag-over样式
  const target = event.target.closest('tr')
  if (target) {
    target.classList.remove('drag-over')
  }
}

/**
 * 处理用户列表拖拽结束事件
 * @param {Event} event - 拖拽事件
 * @param {number} dropIndex - 放置位置的索引
 */
const handleDrop = (event, dropIndex) => {
  event.preventDefault() // 阻止默认行为

  // 移除所有tr元素的拖拽样式
  document.querySelectorAll('.draggable-row').forEach((row) => {
    row.classList.remove('dragging', 'drag-over')
  })

  // 确保拖拽索引有效
  if (dragStartIndex.value !== null && dragStartIndex.value !== dropIndex) {
    // 执行排序操作
    const newUsers = [...userlist.value]
    const [draggedItem] = newUsers.splice(dragStartIndex.value, 1)
    newUsers.splice(dropIndex, 0, draggedItem)
    userlist.value = newUsers

    // 重置拖拽索引
    dragStartIndex.value = null

    // 这里可以添加调用后端 API 的代码，保存排序结果
    console.log('排序后的用户列表:', userlist.value)
  }
}

/**
 * 处理文章列表拖拽结束事件
 * @param {Event} event - 拖拽事件
 * @param {number} dropIndex - 放置位置的索引
 */
const handleArticleDrop = (event, dropIndex) => {
  event.preventDefault() // 阻止默认行为

  // 移除所有tr元素的拖拽样式
  document.querySelectorAll('.draggable-row').forEach((row) => {
    row.classList.remove('dragging', 'drag-over')
  })

  // 确保拖拽索引有效
  if (
    dragStartArticleIndex.value !== null &&
    dragStartArticleIndex.value !== dropIndex
  ) {
    // 执行排序操作
    const newArticles = [...articles.value]
    const [draggedItem] = newArticles.splice(dragStartArticleIndex.value, 1)
    newArticles.splice(dropIndex, 0, draggedItem)
    articles.value = newArticles

    // 重置拖拽索引
    dragStartArticleIndex.value = null

    // 这里可以添加调用后端 API 的代码，保存排序结果
    console.log('排序后的文章列表:', articles.value)
  }
}

// ==================== 方法定义 ====================
/**
 * 获取页面标题
 */
const getPageTitle = () => {
  return t(props.currentMenu)
}

/**
 * 获取页面描述
 */
const getPageDescription = () => {
  const descriptions = {
    personalCenter: '这里是您的个人中心页面',
    userList: '管理系统用户',
    addUser: '添加新用户',
    articleList: '查看所有文章',
    publishArticle: '发布新文章'
  }
  return descriptions[props.currentMenu] || '欢迎使用 Sunday 系统'
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
}

// ==================== 页面内容样式 ====================
.page-content {
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary, #1e293b);
    margin-bottom: 1.5rem;
  }
}

// ==================== 欢迎卡片样式 ====================
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

  h2 {
    color: white;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .user-stats {
    display: flex;
    gap: 2rem;

    .stat-item {
      text-align: center;

      .stat-value {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
      }

      .stat-label {
        font-size: 0.875rem;
        opacity: 0.8;
      }
    }
  }
}

// ==================== 表格容器样式 ====================
.table-container {
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: white;
  padding: 1.5rem;

  .drag-hint {
    color: var(--text-secondary, #64748b);
    font-size: 0.875rem;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;

    th,
    td {
      padding: 1rem 1.25rem;
      text-align: left;
      border-bottom: 1px solid var(--border-color, #e2e8f0);
      transition: all 0.2s ease;
    }

    th {
      background-color: #f1f5f9;
      font-weight: 600;
      color: var(--text-primary, #1e293b);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.75rem;
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    tr {
      transition: all 0.2s ease;

      &:hover {
        background-color: #f8fafc;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
    }

    .drag-handle {
      cursor: grab;
      user-select: none;
      font-size: 1.25rem;
      color: var(--text-secondary, #64748b);
      width: 50px;
      text-align: center;
      transition: all 0.2s ease;
      padding: 0.5rem;
      border-radius: 0.25rem;

      &:hover {
        color: var(--primary-color, #3498db);
        background-color: rgba(52, 152, 219, 0.1);
      }

      &:active {
        cursor: grabbing;
      }
    }

    .draggable-row {
      cursor: move;
      transition: all 0.2s ease;

      &:hover {
        background-color: #f8fafc;
      }

      &.dragging {
        opacity: 0.7;
        background-color: #e2e8f0;
        transform: rotate(2deg);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }

      &.drag-over {
        background-color: #e0f2fe;
        border-left: 4px solid var(--primary-color, #3498db);
      }
    }

    .btn {
      padding: 0.375rem 0.875rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      margin-right: 0.5rem;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      &.btn-edit {
        background-color: #3498db;
        color: white;

        &:hover {
          background-color: #2980b9;
        }
      }

      &.btn-delete {
        background-color: #e74c3c;
        color: white;

        &:hover {
          background-color: #c0392b;
        }
      }
    }
  }
}

// ==================== 表单容器样式 ====================
.form-container {
  .user-form,
  .article-form {
    max-width: 600px;

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-primary, #1e293b);
      }

      input,
      select,
      textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 0.25rem;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }
      }

      textarea {
        resize: vertical;
        min-height: 150px;
      }
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
      border: none;

      &.btn-primary {
        background-color: #3498db;
        color: white;

        &:hover {
          background-color: #2980b9;
        }
      }
    }
  }
}
</style>
