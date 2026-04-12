<template>
  <el-dialog
    v-model="visible"
    title="编辑文章"
    width="900px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    class="article-edit-dialog"
  >
    <div class="edit-form">
      <div class="form-header">
        <el-input
          v-model="editTitle"
          placeholder="请输入文章标题"
          size="large"
          maxlength="100"
          show-word-limit
          clearable
        />
      </div>

      <el-tabs v-model="activeName" class="editor-tabs">
        <el-tab-pane label="Markdown 编辑" name="markdown">
          <div class="markdown-container">
            <div id="edit-markdown-box"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="富文本" name="richtext">
          <div id="edit-editor-box"></div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSave"
          :disabled="!editTitle.trim()"
        >
          {{ loading ? '保存中...' : '保存' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import MKEditor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/zh-CN'
import E from 'wangeditor'
import axios from '../utiles/request'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  article: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

// 对话框显示状态
const visible = ref(false)
// 编辑的标题
const editTitle = ref('')
// 当前选中的编辑器
const activeName = ref('markdown')
// 加载状态
const loading = ref(false)

// 编辑器实例
let mkEditor = null
let richEditor = null
let markdownEl = null
let richEl = null

// 监听 props.modelValue 变化
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.article) {
    // 打开对话框时初始化数据
    editTitle.value = props.article.title || ''
    activeName.value = 'markdown'
    nextTick(() => {
      initEditors()
    })
  }
})

// 监听 visible 变化，同步到父组件
watch(() => visible.value, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    // 关闭时销毁编辑器
    destroyEditors()
  }
})

// 初始化编辑器
const initEditors = () => {
  // 初始化 Markdown 编辑器
  markdownEl = document.getElementById('edit-markdown-box')
  if (markdownEl && !mkEditor) {
    mkEditor = new MKEditor({
      el: markdownEl,
      height: '400px',
      previewStyle: 'vertical',
      initialEditType: 'markdown',
      initialValue: props.article.content || '',
      language: 'zh-CN'
    })
  } else if (mkEditor) {
    mkEditor.setMarkdown(props.article.content || '')
  }

  // 初始化富文本编辑器
  richEl = document.getElementById('edit-editor-box')
  if (richEl && !richEditor) {
    richEditor = new E(richEl)
    richEditor.config.zIndex = 1
    richEditor.config.showMenuTooltips = true
    richEditor.config.menuTooltipPosition = 'down'
    richEditor.create()
    richEditor.txt.html(props.article.content || '')
  } else if (richEditor) {
    richEditor.txt.html(props.article.content || '')
  }
}

// 销毁编辑器
const destroyEditors = () => {
  if (mkEditor) {
    mkEditor.destroy()
    mkEditor = null
  }
  if (richEditor) {
    richEditor.destroy()
    richEditor = null
  }
}

// 获取当前编辑器的内容
const getCurrentContent = () => {
  if (activeName.value === 'markdown' && mkEditor) {
    return mkEditor.getHTML()
  } else if (activeName.value === 'richtext' && richEditor) {
    return richEditor.txt.html()
  }
  return ''
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
}

// 取消编辑
const handleCancel = () => {
  visible.value = false
}

// 保存编辑
const handleSave = async () => {
  if (loading.value) return

  const content = getCurrentContent()

  if (!editTitle.value.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }

  if (!content || content.trim() === '' || content === '<p><br></p>') {
    ElMessage.warning('请输入文章内容')
    return
  }

  try {
    loading.value = true

    const res = await axios.post('http://localhost:3000/aticalEdit', {
      id: props.article.id,
      title: editTitle.value.trim(),
      content: content,
      date: new Date().toISOString(),
      author: props.article.author
    })

    if (res?.data?.code === 200 || res?.code === 200) {
      ElMessage.success('编辑成功')
      visible.value = false
      emit('success')
    } else {
      const errorMsg = res?.data?.msg || res?.data?.message || res?.msg || '编辑失败'
      ElMessage.error(errorMsg)
    }
  } catch (error) {
    console.error('编辑失败:', error)
    const errorMsg = error.response?.data?.msg || error.response?.data?.message || error.message || '网络错误，请稍后重试'
    ElMessage.error('编辑失败：' + errorMsg)
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  destroyEditors()
})
</script>

<style scoped>
.edit-form {
  min-height: 500px;
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
  min-height: 400px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

<style>
.article-edit-dialog .el-dialog__body {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}
</style>
