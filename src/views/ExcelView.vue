<template>
  <div class="excel-container">
    <h1>Excel导入导出测试</h1>
    
    <div class="export-section">
      <h2>导出Excel</h2>
      <p>选择要导出的数据类型</p>
      <div class="button-group">
        <el-button type="primary" @click="exportExcel('user')">导出用户数据</el-button>
        <el-button type="primary" @click="exportExcel('article')">导出文章数据</el-button>
        <el-button type="primary" @click="exportExcel('all')">导出所有数据</el-button>
      </div>
    </div>
    
    <div class="import-section">
      <h2>导入Excel</h2>
      <p>选择要导入的数据类型和文件</p>
      <div class="import-options">
        <el-radio-group v-model="importType">
          <el-radio label="user">用户数据</el-radio>
          <el-radio label="article">文章数据</el-radio>
        </el-radio-group>
      </div>
      <el-upload
        class="upload-demo"
        action="http://localhost:3000/excel/import"
        :auto-upload="false"
        :on-change="handleFileChange"
        :show-file-list="false"
        accept=".xlsx, .xls"
      >
        <el-button type="success">选择Excel文件</el-button>
      </el-upload>
      <el-button v-if="file" type="warning" @click="importExcel">导入Excel</el-button>
    </div>
    
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const file = ref(null)
const message = ref('')
const messageType = ref('success')
const importType = ref('user')

// 处理文件选择
const handleFileChange = (fileObj) => {
  console.log('File selected:', fileObj)
  file.value = fileObj.raw
  message.value = '已选择文件: ' + fileObj.name
  messageType.value = 'info'
}

// 导出Excel
const exportExcel = async (type) => {
  try {
    console.log(`开始导出${type === 'user' ? '用户' : type === 'article' ? '文章' : '所有'}数据...`)
    const response = await axios.get(`http://localhost:3000/excel/export/${type}`, {
      responseType: 'blob'
    })
    console.log('导出Excel成功:', response)
    
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', type === 'user' ? 'users.xlsx' : type === 'article' ? 'articles.xlsx' : 'all_data.xlsx')
    document.body.appendChild(link)
    link.click()
    
    message.value = 'Excel导出成功！'
    messageType.value = 'success'
  } catch (error) {
    console.error('导出失败:', error)
    message.value = `Excel导出失败！ ${error.message}`
    messageType.value = 'error'
  }
}

// 导入Excel
const importExcel = async () => {
  if (!file.value) {
    message.value = '请先选择文件'
    messageType.value = 'warning'
    return
  }
  
  console.log(`开始导入${importType.value === 'user' ? '用户' : '文章'}数据...`)
  const formData = new FormData()
  formData.append('file', file.value)
  
  try {
    const response = await axios.post(`http://localhost:3000/excel/import/${importType.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('导入Excel成功:', response)
    
    message.value = `Excel导入成功！ 导入了 ${response.data.count} 条数据`
    messageType.value = 'success'
    file.value = null
  } catch (error) {
    console.error('导入失败:', error)
    message.value = `Excel导入失败！ ${error.message}`
    messageType.value = 'error'
  }
}
</script>

<style scoped>
.excel-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

h1 {
  color: #303133;
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: #606266;
  margin: 20px 0 10px;
}

.export-section,
.import-section {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

p {
  color: #909399;
  margin-bottom: 15px;
}

.upload-demo {
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.import-options {
  margin-bottom: 15px;
}

.message {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}

.success {
  background: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
}

.error {
  background: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

.warning {
  background: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #faecd8;
}

.info {
  background: #ecf5ff;
  color: #409eff;
  border: 1px solid #d9ecff;
}

/* 暗黑模式样式 */
:global(.dark-mode) {
  .excel-container {
    background: #1e293b;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  }
  
  /* 确保所有文本都显示为白色 */
  h1, h2, h3, h4, h5, h6 {
    color: #f8fafc;
  }
  
  .export-section,
  .import-section {
    background: #334155;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  p, span, div {
    color: #f8fafc;
  }
  
  .success {
    background: rgba(103, 194, 58, 0.1);
    color: #86efac;
    border: 1px solid rgba(103, 194, 58, 0.3);
  }
  
  .error {
    background: rgba(245, 108, 108, 0.1);
    color: #fca5a5;
    border: 1px solid rgba(245, 108, 108, 0.3);
  }
  
  .warning {
    background: rgba(230, 162, 60, 0.1);
    color: #fcd34d;
    border: 1px solid rgba(230, 162, 60, 0.3);
  }
  
  .info {
    background: rgba(64, 158, 255, 0.1);
    color: #93c5fd;
    border: 1px solid rgba(64, 158, 255, 0.3);
  }
}
</style>
