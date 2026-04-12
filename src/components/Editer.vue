<template>
  <div class="editor-container">
    <div id="editor-box"></div>
    <div class="bottom">
      <el-button @click="handleReset">重置</el-button>
      <el-button
        type="primary"
        size="large"
        :loading="loading"
        @click="onSubmitClick"
        :disabled="disabled"
      >
        {{ loading ? '发布中...' : '发布文章' }}
      </el-button>
    </div>
  </div>
</template>
<script setup>
import E from 'wangeditor'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

// 定义 props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['publish-success', 'reset'])

// 加载状态
const loading = ref(false)

//初始化Editor实例
let editor
//获取到dom
let el
const initEditor = () => {
  editor = new E(el)
  editor.config.zIndex = 1

  //菜单栏提示
  editor.config.showMenuTooltips = true
  editor.config.menuTooltipPosition = 'down'
  editor.create()
}

onMounted(() => {
  el = document.getElementById('editor-box')
  initEditor()
})

// 获取编辑器内容
const getContent = () => {
  return editor?.txt.html()
}

// 清空编辑器
const clearContent = () => {
  if (editor) {
    editor.txt.clear()
  }
}

// 重置
const handleReset = () => {
  clearContent()
  emit('reset')
  ElMessage.info('已重置')
}

// 提交
const onSubmitClick = async () => {
  if (loading.value) return

  const content = getContent()

  if (!props.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }

  if (!content || content.trim() === '' || content === '<p><br></p>') {
    ElMessage.warning('请输入文章内容')
    return
  }

  // 触发提交事件，让父组件处理发布逻辑
  emit('submit', {
    title: props.title,
    content: content
  })
}

// 设置加载状态（供父组件调用）
const setLoading = (value) => {
  loading.value = value
}

// 暴露方法给父组件
defineExpose({
  getContent,
  clearContent,
  setLoading
})
</script>
<style scoped>
.editor-container {
  max-width: 1200px;
  margin: 0 auto;
}

#editor-box {
  min-height: 500px;
  background: #fff;
  border-radius: 8px;
}

.bottom {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.bottom .el-button {
  min-width: 100px;
}
</style>
