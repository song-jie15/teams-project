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
                : '请输入您的手机号和验证码'
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

        <form @submit.prevent="handleLogin">
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
                  type="password"
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
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe" />
                <span>记住我</span>
              </label>
              <a href="#" class="forgot-password">忘记密码？</a>
            </div>
          </div>

          <!-- 手机号验证码登录 -->
          <div v-else class="login-panel">
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

          <button type="submit" class="login-button">
            <span>登录</span>
          </button>

          <!-- 其他登录方式 -->
          <div class="other-login">
            <div class="divider">
              <span>其他登录方式</span>
            </div>
            <div class="social-login">
              <button type="button" class="social-button wechat">
                <span>微信</span>
              </button>
              <button type="button" class="social-button qq">
                <span>QQ</span>
              </button>
              <button type="button" class="social-button weibo">
                <span>微博</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

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

const handleLogin = async () => {
  console.log('登录信息:', {
    ...user,
    rememberMe: rememberMe.value,
    loginType: activeTab.value
  })

  try {
    let response
    if (activeTab.value === 'password') {
      response = await axios.post('http://localhost:3000/login', {
        username: user.username,
        password: user.password
      })
    } else {
      response = await axios.post('http://localhost:3000/login/sms', {
        phone: user.phone,
        code: user.code
      })
    }

    const { code, msg, token } = response.data
    if (code === 200) {
      alert(msg)
      localStorage.setItem('token', token)
      router.push('/')
    } else {
      alert(msg)
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请稍后重试')
  }
}

const sendCode = async () => {
  if (!user.phone || user.phone.length !== 11) {
    alert('请输入正确的手机号')
    return
  }

  try {
    const response = await axios.post('http://localhost:3000/sendCode', {
      phone: user.phone
    })

    if (response.data.code === 200) {
      alert('验证码发送成功')
      startCountdown()
    } else {
      alert('验证码发送失败，请稍后重试')
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    alert('发送验证码失败，请稍后重试')
  }
}

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}
</script>
<style scoped>
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
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
  background-image: url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20office%20space%20with%20blue%20gradient%20background%20professional%20corporate%20environment&image_size=landscape_16_9');
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
  background-color: rgba(255, 255, 255, 0.98);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(15px);
  animation: slideIn 0.6s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form-header p {
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0;
}

/* 登录方式切换 */
.login-tabs {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
}

.tab-button {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  color: #3498db;
}

.tab-button.active {
  color: #3498db;
  font-weight: 600;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 3px 3px 0 0;
}

/* 登录面板 */
.login-panel {
  animation: fadeIn 0.4s ease-out;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: #34495e;
  font-size: 0.9rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.input-container:focus-within {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  transform: translateY(-1px);
}

.input-icon {
  padding: 0 1rem;
  font-size: 1.2rem;
  color: #95a5a6;
}

.form-input {
  flex: 1;
  padding: 1rem;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
  color: #2c3e50;
}

.form-input::placeholder {
  color: #bdc3c7;
}

/* 密码切换按钮 */
.toggle-password {
  padding: 0 1rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #95a5a6;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #3498db;
}

/* 验证码容器 */
.code-container {
  display: flex;
  align-items: center;
}

.code-input {
  flex: 1;
}

.code-button {
  padding: 0 1.5rem;
  height: 100%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.code-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #2980b9, #1f618d);
}

.code-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.85rem;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.remember-me:hover {
  color: #3498db;
}

.remember-me input {
  margin-right: 0.5rem;
  accent-color: #3498db;
  cursor: pointer;
}

.forgot-password {
  color: #3498db;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.forgot-password:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  padding: 1.1rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.login-button:hover {
  background: linear-gradient(135deg, #2980b9, #1f618d);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
}

.login-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.login-button span {
  position: relative;
  z-index: 2;
}

.login-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0)
  );
  transform: rotate(45deg);
  transition: all 0.6s ease;
  opacity: 0;
}

.login-button:hover::before {
  animation: shine 1.5s ease;
}

/* 其他登录方式 */
.other-login {
  margin-top: 2rem;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #bdc3c7;
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #e0e0e0;
  margin: 0 1rem;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.social-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.social-button.wechat {
  background-color: #07c160;
  color: white;
}

.social-button.qq {
  background-color: #1da1f2;
  color: white;
}

.social-button.weibo {
  background-color: #e6162d;
  color: white;
}

.social-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 动画 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shine {
  0% {
    opacity: 0;
    transform: translateX(-100%) rotate(45deg);
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: translateX(100%) rotate(45deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-form {
    padding: 2rem;
  }

  .form-header h2 {
    font-size: 1.75rem;
  }

  .social-login {
    gap: 1rem;
  }

  .social-button {
    width: 40px;
    height: 40px;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
  }

  .form-header h2 {
    font-size: 1.5rem;
  }

  .form-input {
    padding: 0.875rem;
  }

  .login-button {
    padding: 1rem;
  }
}
</style>
