<template>
  <div>
    <el-input v-model="title" placeholder="请输入标题"></el-input>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="markDown" name="first">
        <div class="markdown-container">
          <!-- 渲染区域 -->
          <div id="markdown-box"></div>
          <!-- 按钮 -->
          <div class="button">
            <el-button type="primary" @click="onSubmitClick">发布</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="副文本" name="second"> 副文本 </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import MKEditor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/zh-CN'
import { languages } from 'eslint-plugin-prettier'
const activeName = ref('first')
let mkEditor
let el
onMounted(() => {
  el = document.getElementById('markdown-box')
  initEditor()
})
const initEditor = () => {
  mkEditor = new MKEditor({
    el,
    height: '500px',
    previewStyle: 'vertical',
    height: '500px'
  })
  mkEditor.getMarkdown()
}

const onSubmitClick = () => {
  console.log('发布')
}
</script>
<style scoped>
.markdown-container {
  .button {
    margin-top: 20px;
  }
}
.button .el-button {
  float: right;
}
</style>
