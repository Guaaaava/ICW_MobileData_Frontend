<template>
  <view class="login-container">
    <image src="@/static/background.png" mode="widthFix" class="background-image"></image>
    <view class="login-box">
      <image src="@/static/logo.png" alt="Logo" class="logo"></image>
      <input type="text" placeholder="用户名" v-model="username" class="input-field" />
      <input type="password" placeholder="密码" v-model="password" class="input-field" />
      <view class="button-group">
        <button @click="login" class="device-button">登录</button>
        <button @click="register" class="device-button">注册</button>
      </view>
    </view>
  </view>
</template>

<script>
	const BASE_URL ="http://110.42.214.164:8008/account";
export default {
  data() {
    return {
      username: '',
      password: '',
      loading: false,
    };
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        uni.showToast({
          title: '用户名或密码不能为空',
          icon: 'none',
        });
        return;
      }

      this.loading = true; // 开始加载
      
     try {
           // 发送登录请求
           const response = await uni.request({
             url: `${BASE_URL}/login`, // 替换为实际的登录API地址
             method: 'POST',
             data: {
               username: this.username,
               password: this.password,
             },
           });
     
           // 检查后端响应
           if (response.data && response.data.authentication) {
             // 登录成功逻辑
             if (response.data.authentication === true) {
               uni.showToast({
                 title: '登录成功',
                 icon: 'success',
               });
               // 保存token等操作
               // 例如：保存token到本地存储
               // uni.setStorageSync('userToken', response.data.token);
               // 跳转到首页或其他页面
               setTimeout(() => {
                 uni.navigateTo({
                   url: '/pages/index/Guide',
                 });
               }, 1000);
             } else {
               // 登录失败逻辑
               uni.showToast({
                 title: response.data.message || '登录失败',
                 icon: 'none',
               });
             }
           } else {
             // 响应数据不符合预期
             uni.showToast({
               title: '登录失败：账号或者密码错误',
               icon: 'none',
             });
           }
         } catch (error) {
           // 网络或其他错误处理
           uni.showToast({
             title: '网络错误，请稍后再试',
             icon: 'none',
           });
           console.error('请求错误：', error);
         } finally {
           this.loading = false; // 结束加载
         }
       },
     },
};
</script>

<style>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100vh;
  justify-content: center;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; /* 使用100vh确保图片覆盖整个视口高度 */
  object-fit: cover; /* 确保图片覆盖整个容器，同时保持宽高比 */
  background-repeat: no-repeat; /* 防止图片重复 */
  background-attachment: fixed; /* 背景图片固定，不随滚动条滚动 */
  background-position: center; /* 背景图片居中显示 */
  z-index: -1; /* 确保背景图片在内容之下 */
}

.login-box {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #007BFF;
}

.button-group {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.device-button {
  width: 48%; /* 根据需要调整宽度 */
  height: 60px; /* 与设备按钮高度一致 */
  margin: 10px;
  border: none;
  border-radius: 8px;
  background-color: #e0f7fa; /* 与设备按钮背景一致 */
  color: #333;
  font-size: 20px; /* 与设备按钮字体大小一致 */
  line-height: 60px; /* 与设备按钮高度一致，垂直居中文本 */
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.device-button:hover {
  background-color: #4caf50; /* 与设备按钮悬浮效果一致 */
  color: white;
}

.device-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>