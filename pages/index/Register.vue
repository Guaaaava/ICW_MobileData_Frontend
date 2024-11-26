<template>
  <view class="register-container">
    <image src="@/static/background.png" mode="widthFix" class="background-image"></image>
    <view class="back-to-login" @click="goBack">返回登录</view>
    <view class="login-box">
      <image src="@/static/logo.png" alt="Logo" class="logo"></image>
      <input type="text" placeholder="用户名" v-model="username" class="input-field" />
      <input type="password" placeholder="密码" v-model="password" class="input-field" />
      <input type="password" placeholder="请确定密码" v-model="repassword" class="input-field" />
      <view class="button-group">
        <button @click="register" class="device-button">注册</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      repassword: '' // 添加repassword数据绑定
    };
  },
  methods: {
    goBack() {
      // 使用 uni.navigateBack 跳转到上一页
      uni.navigateBack({
        delta: 1 // 回退前 delta（默认为1）页面
      });
    },
    register() {
      // 注册逻辑
    }
  }
}
</script>

<style>
.register-container {
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
  position: relative; /* 添加相对定位 */
}

.background-image {
  position: fixed;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
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
  justify-content: center;
  margin-top: 10px;
}

.device-button {
  width: 80%; /* 根据需要调整宽度 */
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

.back-to-login {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  background-color: #e0f7fa; /* 与设备按钮背景一致 */
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-to-login:hover {
  background-color: #4caf50; /* 与设备按钮悬浮效果一致 */
  color: white;
}
</style>