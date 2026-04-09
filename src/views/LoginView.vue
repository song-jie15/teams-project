<template>
  <div class="login-container">
    <div class="login-bg"></div>
    <div class="login-content">
      <div class="login-form">
        <div class="form-header">
          <h2>欢迎登录</h2>
          <p>
            {{
              activeTab === 'password'
                ? '请输入您的账号和密码'
                : activeTab === 'sms'
                  ? '请输入您的手机号和验证码'
                  : tip
            }}
          </p>
        </div>

        <!-- 登录方式切换 -->
        <div class="login-tabs">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'password' }"
            @click="activeTab = 'password'"
          >
            账号密码登录
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'sms' }"
            @click="activeTab = 'sms'"
          >
            手机号登录
          </button>
        </div>

        <form @submit.prevent="handleLogin" v-if="activeTab !== 'qrcode'">
          <!-- 账号密码登录 -->
          <div v-if="activeTab === 'password'" class="login-panel">
            <div class="form-group">
              <label for="username">用户名</label>
              <div class="input-container">
                <span class="input-icon">👤</span>
                <input
                  type="text"
                  id="username"
                  v-model="user.username"
                  required
                  class="form-input"
                  placeholder="请输入用户名"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="password">密码</label>
              <div class="input-container">
                <span class="input-icon">🔒</span>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="user.password"
                  required
                  class="form-input"
                  placeholder="请输入密码"
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
            </div>
            <div class="form-options">
              <label class="remember-me"
                ><input type="checkbox" v-model="rememberMe" /><span
                  >记住我</span
                ></label
              >
              <a href="#" class="forgot-password">忘记密码？</a>
            </div>
          </div>

          <!-- 手机号验证码登录 -->
          <div v-else-if="activeTab === 'sms'" class="login-panel">
            <div class="form-group">
              <label for="phone">手机号</label>
              <div class="input-container">
                <span class="input-icon">📱</span>
                <input
                  type="tel"
                  id="phone"
                  v-model="user.phone"
                  required
                  class="form-input"
                  placeholder="请输入手机号"
                  maxlength="11"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="code">验证码</label>
              <div class="input-container code-container">
                <span class="input-icon">📝</span>
                <input
                  type="text"
                  id="code"
                  v-model="user.code"
                  required
                  class="form-input code-input"
                  placeholder="请输入验证码"
                  maxlength="6"
                />
                <button
                  type="button"
                  class="code-button"
                  :disabled="countdown > 0"
                  @click="sendCode"
                >
                  {{ countdown > 0 ? `${countdown}s后重新发送` : '获取验证码' }}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" class="login-button">登录</button>

          <!-- 二维码登录选项 -->
          <div class="login-divider">
            <span>其他登录方式</span>
          </div>
          <div class="qrcode-login-option">
            <button
              type="button"
              class="qrcode-login-button"
              @click="switchToQrcode"
            >
              <span class="qrcode-icon">📱</span>
              <span>二维码登录</span>
            </button>
          </div>
        </form>

        <!-- 二维码登录面板 -->
        <div v-else-if="activeTab === 'qrcode'" class="login-panel">
          <div class="qrcode-container">
            <div class="qrcode-header">
              <h3>扫码登录</h3>
              <p>{{ tip }}</p>
            </div>
            <div class="qrcode-image">
              <img :src="qrUrl" style="width: 160px; height: 160px" />
            </div>
            <button class="refresh-qrcode" @click="init">刷新二维码</button>
            <div class="back-to-form">
              <button
                type="button"
                class="back-button"
                @click="activeTab = 'password'"
              >
                ← 返回账号密码登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import QRCode from 'qrcode'
import { ElMessage } from 'element-plus'

const router = useRouter()
const rememberMe = ref(false)
const showPassword = ref(false)
const activeTab = ref('password')
const countdown = ref(0)

const user = reactive({
  username: '',
  password: '',
  phone: '',
  code: ''
})

// —————————————————— 原有登录逻辑 ——————————————————
const handleLogin = async () => {
  try {
    let response
    if (activeTab.value === 'password') {
      response = await axios.post('http://localhost:3000/login', {
        username: user.username,
        password: user.password
      })
    } else {
      response = await axios.post('http://localhost:3000/loginByCode', {
        phone: user.phone,
        code: user.code
      })
    }

    const { code, msg, token } = response.data
    if (code === 200) {
      ElMessage.success(msg)
      localStorage.setItem('token', token)
      router.push('/')
    } else {
      ElMessage.error(msg)
    }
  } catch (error) {
    console.log(error)

    ElMessage.error('登录失败，请稍后重试')
  }
}

const sendCode = async () => {
  if (!user.phone || user.phone.length !== 11) {
    ElMessage.error('请输入正确的手机号')
    return
  }

  try {
    const res = await axios.post('http://localhost:3000/sendCode', {
      phone: user.phone
    })
    if (res.data.code === 200) {
      ElMessage.success('验证码发送成功')
      startCountdown()
    } else {
      ElMessage.error(res.data.msg)
    }
  } catch (error) {
    console.log(error)

    ElMessage.error('发送失败')
  }
}

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

// —————————————————— 二维码登录（修复完毕）——————————————————
const qrToken = ref('')
const qrUrl = ref('')
const tip = ref('加载中...')
let timer = null

// 统一用 localhost
const API = 'http://localhost:3000'

// 切换到二维码时自动刷新
async function switchToQrcode() {
  activeTab.value = 'qrcode'
  await init()
}

// 初始化二维码
async function init() {
  clearInterval(timer)
  try {
    const { data } = await axios.get(API + '/api/qr/generate')
    qrToken.value = data.qrToken
    qrUrl.value = await QRCode.toDataURL(data.qrContent)
    tip.value = '请扫码登录'
    startPoll()
  } catch (e) {
    console.log(e)

    tip.value = '二维码加载失败'
  }
}

// 轮询状态
function startPoll() {
  timer = setInterval(async () => {
    if (!qrToken.value) return
    try {
      const res = await axios.get(API + '/api/qr/status', {
        params: { token: qrToken.value }
      })
      if (res.data.status === 2) {
        clearInterval(timer)
        tip.value = '登录成功'
        localStorage.setItem('token', res.data.token)
        ElMessage.success('登录成功')
        router.push('/')
      } else if (res.data.status === 3) {
        clearInterval(timer)
        tip.value = '二维码已过期'
      }
    } catch (e) {
      console.log(e)
    }
  }, 1500)
}

watch(activeTab, (val) => {
  if (val !== 'qrcode') clearInterval(timer)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.login-container {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/img/1.png');
  background-size: cover;
  background-position: center;
  filter: brightness(0.5) blur(2px);
  z-index: 1;
}

.login-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 480px;
  padding: 0 20px;
}

.login-form {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  width: 400px;
  height: 600px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}

.form-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0;
}

.login-tabs {
  display: flex;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.tab-button {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
}

.tab-button:hover,
.tab-button.active {
  color: #3498db;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #3498db;
}

.login-panel {
  margin-bottom: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: border-color 0.3s ease;
}

.input-icon {
  padding: 0 0.875rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.form-input {
  flex: 1;
  padding: 0.75rem;
  border: none;
  outline: none;
  font-size: 0.85rem;
  background: transparent;
  color: white;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.toggle-password {
  padding: 0 1rem;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
}

.code-container {
  display: flex;
  align-items: center;
}

.code-input {
  flex: 1;
  border-radius: 6px 0 0 6px;
}

.code-button {
  height: 100%;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 0 6px 6px 0;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  padding: 0 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.code-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #2980b9 0%, #1f618d 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.code-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.code-button:disabled {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
  box-shadow: none;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
}

.remember-me input {
  margin-right: 0.5rem;
  accent-color: #3498db;
}

.forgot-password {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.login-button {
  width: 100%;
  padding: 0.875rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background: #2980b9;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  flex: 1;
  justify-content: center;
  margin-top: -50px;
}

.back-to-form {
  margin-top: 1.25rem;
  width: 100%;
  text-align: center;
}

.back-button {
  background: none;
  border: none;
  color: #3498db;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #2980b9;
  text-decoration: underline;
}

.qrcode-header {
  text-align: center;
  margin-bottom: 1.25rem;
  margin-top: 50px;
}

.qrcode-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.qrcode-header p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  margin: 0;
}

.qrcode-image {
  background-color: white;
  padding: 0.875rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.25rem;
}

.refresh-qrcode {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #3498db;
  border: 1px solid #3498db;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 10px;
}

.refresh-qrcode:hover {
  background-color: #3498db;
  color: white;
}

.login-divider {
  display: flex;
  align-items: center;
  margin: 1.25rem 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  margin-top: 20px;
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 0 1rem;
}

.qrcode-login-option {
  margin-top: 0.875rem;
}

.qrcode-login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #3498db;
  border: 1px solid #3498db;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.qrcode-icon {
  font-size: 1.1rem;
}

.qrcode-login-button:hover {
  background-color: #3498db;
  color: white;
}

@media (max-width: 480px) {
  .login-form {
    width: 320px;
    height: 500px;
    padding: 1.5rem;
  }
  .form-header h2 {
    font-size: 1.5rem;
  }
  .form-input {
    padding: 0.75rem;
  }
  .qrcode-image img {
    width: 160px;
    height: 160px;
  }
}
</style>
