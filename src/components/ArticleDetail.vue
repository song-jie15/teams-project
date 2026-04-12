<template>
  <div class="article-detail">
    <div class="detail-header">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item @click="$emit('back')">文章</el-breadcrumb-item>
          <el-breadcrumb-item @click="$emit('back')">文章列表</el-breadcrumb-item>
          <el-breadcrumb-item>文章详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span class="author">作者：{{ article.zuozhe || article.author }}</span>
        <span class="dot">·</span>
        <span class="date">发布时间：{{ formatDate(article.date) }}</span>
        <el-button 
          type="primary" 
          size="small" 
          class="edit-button"
          @click="$emit('edit', article)"
        >
          编辑
        </el-button>
      </div>
    </div>
    
    <div class="article-content" v-html="article.content"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  article: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['edit', 'back'])

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  let timestamp
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
  } else if (typeof date === 'number') {
    timestamp = date
  } else {
    return ''
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
</script>

<style scoped>
.article-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  min-height: 80vh;
}

.detail-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.article-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #999;
}

.author {
  margin-right: 10px;
}

.dot {
  margin: 0 10px;
}

.edit-button {
  margin-left: auto;
}

.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  min-height: 400px;
}

.article-content h1 {
  font-size: 28px;
  font-weight: bold;
  margin: 30px 0 20px 0;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 2px solid #eaeaea;
}

.article-content h2 {
  font-size: 24px;
  font-weight: bold;
  margin: 25px 0 15px 0;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #eaeaea;
}

.article-content h3 {
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0 15px 0;
  color: #333;
}

.article-content h4 {
  font-size: 18px;
  font-weight: bold;
  margin: 15px 0 10px 0;
  color: #333;
}

.article-content h5 {
  font-size: 16px;
  font-weight: bold;
  margin: 15px 0 10px 0;
  color: #333;
}

.article-content h6 {
  font-size: 14px;
  font-weight: bold;
  margin: 15px 0 10px 0;
  color: #333;
}

.article-content p {
  margin-bottom: 15px;
  text-align: justify;
}

.article-content img {
  max-width: 100%;
  height: auto;
  margin: 20px 0;
  border-radius: 4px;
  display: block;
}

.article-content code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  color: #e96900;
}

.article-content pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 20px 0;
  font-size: 14px;
}

.article-content pre code {
  background: none;
  padding: 0;
  color: #333;
}

.article-content ul,
.article-content ol {
  margin: 15px 0;
  padding-left: 30px;
}

.article-content ul {
  list-style-type: disc;
}

.article-content ol {
  list-style-type: decimal;
}

.article-content li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.article-content li ul,
.article-content li ol {
  margin: 8px 0;
  padding-left: 20px;
}

.article-content blockquote {
  border-left: 4px solid #409eff;
  padding: 10px 15px;
  margin: 20px 0;
  color: #666;
  font-style: italic;
  background: #f9f9f9;
  border-radius: 0 4px 4px 0;
}

.article-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 14px;
}

.article-content table th,
.article-content table td {
  padding: 10px;
  border: 1px solid #eaeaea;
  text-align: left;
}

.article-content table th {
  background: #f5f5f5;
  font-weight: bold;
}

.article-content a {
  color: #409eff;
  text-decoration: none;
}

.article-content a:hover {
  text-decoration: underline;
}

.article-content strong {
  font-weight: bold;
  color: #333;
}

.article-content em {
  font-style: italic;
  color: #666;
}

.article-content u {
  text-decoration: underline;
}

.article-content s {
  text-decoration: line-through;
  color: #999;
}
</style>
