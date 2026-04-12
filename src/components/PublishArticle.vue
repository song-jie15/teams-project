<template>
  <div class="publish-container">
    <div class="form-header">
      <el-input 
        v-model="title" 
        placeholder="请输入文章标题" 
        size="large"
        maxlength="100"
        show-word-limit
        clearable
      />
    </div>
    
    <el-tabs v-model="activeName" class="editor-tabs">
      <el-tab-pane label="Markdown 编辑" name="first">
        <div class="markdown-container">
          <div id="markdown-box"></div>
          <div class="button">
            <el-button @click="handleReset">重置</el-button>
            <el-button 
              type="primary" 
              size="large"
              :loading="loading" 
              @click="onSubmitClick"
              :disabled="!title.trim()"
            >
              {{ loading ? '发布中...' : '发布文章' }}
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="副文本" name="second">
        <div class="editor-container">
          <Editer
            ref="editerRef"
            :title="title"
            :disabled="!title.trim()"
            @submit="handleEditorSubmit"
            @reset="handleEditorReset"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import Editer from './Editer.vue'

import { onMounted, ref, onBeforeUnmount } from 'vue'
import MKEditor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/zh-CN'
import axios from '../utiles/request'
import { ElMessage } from 'element-plus'

// 定义事件
const emit = defineEmits(['publish-success'])

const activeName = ref('first')
const title = ref('')
const role = ref('')
const loading = ref(false)
const editerLoading = ref(false)
const editerRef = ref(null)
let mkEditor = null
let el = null

onMounted(() => {
  el = document.getElementById('markdown-box')
  initEditor()
})

onBeforeUnmount(() => {
  if (mkEditor) {
    mkEditor.destroy()
  }
})

const initEditor = () => {
  if (el) {
    mkEditor = new MKEditor({
      el,
      height: '500px',
      previewStyle: 'vertical',
      initialContent: '',
      language: 'zh-CN'
    })
  }
}

const handleReset = () => {
  title.value = ''
  if (mkEditor) {
    mkEditor.setMarkdown('')
  }
  // 同时重置富文本编辑器
  if (editerRef.value) {
    editerRef.value.clearContent()
  }
  ElMessage.info('已重置')
}

// 富文本编辑器重置事件
const handleEditorReset = () => {
  title.value = ''
  if (mkEditor) {
    mkEditor.setMarkdown('')
  }
}

// 富文本编辑器提交事件
const handleEditorSubmit = async ({ title: articleTitle, content }) => {
  if (editerLoading.value) return

  try {
    const userInfo = localStorage.getItem('userInfo')
    if (!userInfo) {
      ElMessage.error('请先登录')
      return
    }

    const user = JSON.parse(userInfo)
    role.value = user.username

    editerLoading.value = true
    if (editerRef.value) {
      editerRef.value.setLoading(true)
    }

    const res = await axios.post('http://localhost:3000/aticalAdd', {
      title: articleTitle.trim(),
      content: content,
      date: new Date().toISOString(),
      author: role.value
    })

    console.log('发布响应:', res, 999)

    if (res?.data?.code === 200 || res?.code === 200) {
      ElMessage.success('发布成功')
      title.value = ''
      if (editerRef.value) {
        editerRef.value.clearContent()
      }
      // 触发发布成功事件，通知父组件刷新列表
      emit('publish-success')
    } else {
      const errorMsg = res?.data?.msg || res?.data?.message || res?.msg || '发布失败'
      ElMessage.error(errorMsg)
    }
  } catch (error) {
    console.error('发布失败:', error)
    const errorMsg = error.response?.data?.msg || error.response?.data?.message || error.message || '网络错误，请稍后重试'
    ElMessage.error('发布失败：' + errorMsg)
  } finally {
    editerLoading.value = false
    if (editerRef.value) {
      editerRef.value.setLoading(false)
    }
  }
}

const onSubmitClick = async () => {
  if (loading.value) return
  
  const content = mkEditor?.getHTML()
  
  if (!title.value.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }
  
  if (!content || content.trim() === '') {
    ElMessage.warning('请输入文章内容')
    return
  }
  
  try {
    const userInfo = localStorage.getItem('userInfo')
    if (!userInfo) {
      ElMessage.error('请先登录')
      return
    }
    
    const user = JSON.parse(userInfo)
    role.value = user.username
    
    loading.value = true
    
    const res = await axios.post('http://localhost:3000/aticalAdd', {
      title: title.value.trim(),
      content: content,
      date: new Date().toISOString(),
      author: role.value
    })
    
    console.log('发布响应:', res, 999)
    
    if (res?.data?.code === 200 || res?.code === 200) {
      ElMessage.success('发布成功')
      title.value = ''
      mkEditor.setMarkdown('')
      activeName.value = 'first'
      // 触发发布成功事件，通知父组件刷新列表
      emit('publish-success')
    } else {
      const errorMsg = res?.data?.msg || res?.data?.message || res?.msg || '发布失败'
      ElMessage.error(errorMsg)
    }
  } catch (error) {
    console.error('发布失败:', error)
    const errorMsg = error.response?.data?.msg || error.response?.data?.message || error.message || '网络错误，请稍后重试'
    ElMessage.error('发布失败：' + errorMsg)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.publish-container {
  max-width: 1200px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 1.5rem;
}

.editor-tabs {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.markdown-container {
  min-height: 600px;
  
  .button {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

.preview-content {
  padding: 20px;
  min-height: 400px;
  line-height: 1.8;
  font-size: 15px;
}

.button .el-button {
  min-width: 100px;
}
</style>
