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
                <td>
                  <!-- 1:为皇上，2：为太监，3为平明 -->
                  {{ user.roleId === 1 ? '皇上' : user.roleId === 2 ? '帅哥' : '平民' }}
                  <br>
                </td>
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
          <form class="user-form" @submit.prevent="handleAddUser">
            <div class="form-group">
              <label>用户名</label>
              <el-input
                v-model="addUserForm.username"
                placeholder="请输入用户名"
                clearable
                required
              />
            </div>
            <div class="form-group">
              <label>密码</label>
              <el-input
                v-model="addUserForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                clearable
                required
              />
            </div>
            <div class="form-group">
              <label>角色</label>
              <el-select
                v-model="addUserForm.roleId"
                placeholder="请选择角色"
                required
              >
                <el-option label="皇上" value="1" />
                <el-option label="太监" value="2" />
                <el-option label="平民" value="3" />
              </el-select>
            </div>
            <el-button
              type="primary"
              native-type="submit"
              :loading="addUserLoading"
            >
              {{ addUserLoading ? '添加中...' : '提交' }}
            </el-button>
          </form>
        </div>
      </div>

      <!-- 文章列表 -->
      <div v-else-if="currentMenu === 'articleList' && !showArticleDetail" class="page-content">
        <div class="table-container">
          <div class="table-header">
            <h2>文章列表</h2>
            <div class="search-box">
              <el-input
                v-model="searchQuery"
                placeholder="搜索文章标题或作者..."
                clearable
                prefix-icon="Search"
                style="width: 300px"
                @input="filterArticles"
              />
            </div>
          </div>
          
          <p class="drag-hint">提示：可以拖拽文章行进行排序</p>
          
          <div v-loading="loading" element-loading-text="加载中..." class="table-wrapper">
            <table class="data-table" v-if="paginatedArticles.length > 0">
              <thead>
                <tr>
                  <th style="width: 50px;">排序</th>
                  <th style="width: 60px;">ID</th>
                  <th>标题</th>
                  <th style="width: 300px;">内容预览</th>
                  <th style="width: 100px;">作者</th>
                  <th style="width: 180px;">发布时间</th>
                  <th style="width: 180px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(article, index) in paginatedArticles"
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
                  <td>
                    <div class="article-title">{{ article.title }}</div>
                  </td>
                  <td>
                    <div class="content-preview" v-html="stripHtml(article.content)"></div>
                  </td>
                  <td>{{ article.zuozhe || article.author }}</td>
                  <td>{{ formatDate(article.date) }}</td>
                  <td>
                    <div class="action-buttons">
                      <el-button 
                        type="primary" 
                        size="small" 
                        @click="handleEdit(article)"
                      >
                        编辑
                      </el-button>
                      <el-button 
                        type="info" 
                        size="small" 
                        @click="handleView(article)"
                      >
                        查看
                      </el-button>
                      <el-button 
                        type="danger" 
                        size="small" 
                        @click="handleDelete(article)"
                      >
                        删除
                      </el-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <el-empty v-else description="暂无文章" />
          </div>
          
          <div class="pagination-container" v-if="filteredArticles.length > 0">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="filteredArticles.length"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
      
      <!-- 文章详情 -->
      <div v-else-if="currentMenu === 'articleList' && showArticleDetail" class="page-content">
        <ArticleDetail
          :article="currentArticle"
          @edit="handleDetailEdit"
          @back="handleDetailBack"
        />
      </div>

      <!-- 发布文章 -->
      <div v-else-if="currentMenu === 'publishArticle'" class="page-content">
        <div class="form-container">
          <PublishArticle @publish-success="getArticallist" />
        </div>
      </div>
      <!-- 数据可视化 -->
      <div v-else-if="currentMenu === 'datalist'" class="page-content">
        <chart></chart>
      </div>
    </div>

    <!-- 文章编辑模态框 -->
    <ArticleEditModal
      v-model="editModalVisible"
      :article="currentEditArticle"
      @success="handleEditSuccess"
    />
  </main>
</template>

<script setup>
import axios from '../../utiles/request'
import { ref, onMounted, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PublishArticle from '../PublishArticle.vue'
import ArticleEditModal from '../ArticleEditModal.vue'
import ArticleDetail from '../ArticleDetail.vue'
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
  loading.value = true
  try {
    const res = await axios.post('http://localhost:3000/articlelist')
    articles.value = res.data || []
    filteredArticles.value = articles.value
    console.log('获取后端文章数据', res.data)
  } catch (error) {
    console.error('获取文章列表失败:', error)
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}
//调用函数
onMounted(() => {
  getUserlist()
  getArticallist()
})
// 文章数据
const articles = ref([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const filteredArticles = ref([])

// 添加用户相关
const addUserForm = ref({
  username: '',
  password: '',
  roleId: ''
})
const addUserLoading = ref(false)

// 过滤文章
const filterArticles = () => {
  if (!searchQuery.value) {
    filteredArticles.value = articles.value
  } else {
    const query = searchQuery.value.toLowerCase()
    filteredArticles.value = articles.value.filter(article => {
      const title = (article.title || '').toLowerCase()
      const author = (article.zuozhe || article.author || '').toLowerCase()
      return title.includes(query) || author.includes(query)
    })
  }
  currentPage.value = 1
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 分页计算属性
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredArticles.value.slice(start, end)
})

// HTML 标签去除，显示纯文本预览
const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  const text = tmp.textContent || tmp.innerText || ''
  return text.length > 80 ? text.substring(0, 80) + '...' : text
}

// 编辑文章模态框相关
const editModalVisible = ref(false)
const currentEditArticle = ref({})

// 文章详情相关
const showArticleDetail = ref(false)
const currentArticle = ref({})

// 编辑文章
const handleEdit = (article) => {
  currentEditArticle.value = { ...article }
  editModalVisible.value = true
  showArticleDetail.value = false
}

// 查看文章
const handleView = (article) => {
  currentArticle.value = { ...article }
  showArticleDetail.value = true
}

// 编辑成功回调
const handleEditSuccess = () => {
  getArticallist()
}

// 从详情页编辑
const handleDetailEdit = (article) => {
  currentEditArticle.value = { ...article }
  editModalVisible.value = true
  showArticleDetail.value = false
}

// 从详情页返回列表
const handleDetailBack = () => {
  showArticleDetail.value = false
}

// 添加用户
const handleAddUser = async () => {
  if (!addUserForm.value.username.trim()) {
    ElMessage.warning('请输入用户名')
    return
  }
  
  if (!addUserForm.value.password.trim()) {
    ElMessage.warning('请输入密码')
    return
  }
  
  if (!addUserForm.value.roleId) {
    ElMessage.warning('请选择角色')
    return
  }
  
  try {
    addUserLoading.value = true
    
    console.log('发送添加用户请求:', {
      username: addUserForm.value.username.trim(),
      password: addUserForm.value.password.trim(),
      roleId: addUserForm.value.roleId
    })
    
    const res = await axios.post('http://localhost:3000/add', {
      username: addUserForm.value.username.trim(),
      password: addUserForm.value.password.trim(),
      roleId: addUserForm.value.roleId
    })
    
    console.log('添加用户响应:', res)
    
    if (res?.code === 200) {
      ElMessage.success('添加用户成功')
      // 重置表单
      addUserForm.value = {
        username: '',
        password: '',
        roleId: ''
      }
      // 刷新用户列表
      await getUserlist()
    } else {
      const errorMsg = res?.message || res?.msg || '添加用户失败'
      console.error('添加用户失败:', res)
      ElMessage.error(errorMsg)
    }
  } catch (error) {
    console.error('添加用户异常:', error)
    console.error('错误详情:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    })
    const errorMsg = error.response?.data?.message || error.response?.data?.msg || error.message || '网络错误，请稍后重试'
    ElMessage.error('添加用户失败：' + errorMsg)
  } finally {
    addUserLoading.value = false
  }
}

// 删除文章
const handleDelete = (article) => {
  ElMessageBox.confirm(
    `确定要删除文章《${article.title}》吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      loading.value = true
      const res = await axios.post('http://localhost:3000/aticalDel', { id: article.id })
      
      if (res?.data?.code === 200 || res?.code === 200) {
        ElMessage.success('删除成功')
        // 重新获取文章列表以确保数据最新
        await getArticallist()
      } else {
        ElMessage.error(res?.data?.msg || res?.data?.message || '删除失败')
      }
    } catch (error) {
      ElMessage.error('删除失败：' + (error.response?.data?.msg || error.message))
    } finally {
      loading.value = false
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

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
    // 执行排序操作（修改filteredArticles，这样分页和搜索结果也能正确拖拽）
    const newArticles = [...filteredArticles.value]
    const [draggedItem] = newArticles.splice(dragStartArticleIndex.value, 1)
    newArticles.splice(dropIndex, 0, draggedItem)
    filteredArticles.value = newArticles

    // 同时更新原始articles数组，保持数据一致性
    const originalIndex = articles.value.findIndex(a => a.id === draggedItem.id)
    if (originalIndex !== -1) {
      const newOriginalArticles = [...articles.value]
      newOriginalArticles.splice(originalIndex, 1)
      // 计算在原始数组中的新位置
      const newOriginalIndex = dropIndex < dragStartArticleIndex.value 
        ? dropIndex 
        : dropIndex + (originalIndex < dropIndex ? 0 : 1)
      newOriginalArticles.splice(newOriginalIndex, 0, draggedItem)
      articles.value = newOriginalArticles
    }

    // 重置拖拽索引
    dragStartArticleIndex.value = null

    // 这里可以添加调用后端 API 的代码，保存排序结果
    console.log('排序后的文章列表:', filteredArticles.value)
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
  
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    h2 {
      margin-bottom: 0;
    }
    
    .search-box {
      display: flex;
      gap: 12px;
    }
  }

  .drag-hint {
    color: var(--text-secondary, #64748b);
    font-size: 0.875rem;
    margin-bottom: 1rem;
    font-weight: 500;
  }
  
  .table-wrapper {
    position: relative;
    min-height: 200px;
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
    
    .article-title {
      font-weight: 500;
      color: var(--text-primary, #1e293b);
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .content-preview {
      color: var(--text-secondary, #64748b);
      font-size: 0.8rem;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.5;
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

    .action-buttons {
      display: flex;
      gap: 8px;
      align-items: center;
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
  
  .pagination-container {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;
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
