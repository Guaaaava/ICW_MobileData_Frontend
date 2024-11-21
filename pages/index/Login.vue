<template>
  <view class="login-container">
    <image src="@/static/logo.png" mode="widthFix" class="background-image"></image>
    <view class="login-box">
      <image src="@/static/logo.png" alt="Logo" class="logo"></image>
      <input type="text" placeholder="用户名" v-model="username" class="input-field" />
      <input type="password" placeholder="密码" v-model="password" class="input-field" />
      <view class="button-group">
        <button @click="login" class="login-button">登录</button>
        <button @click="register" class="register-button">注册</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    login() {
      // 使用 uni.navigateTo 跳转到数据展示页面
      uni.navigateTo({
        url: '/pages/index/SelectBuilding'
      });
    },
    register() {
      // 使用 uni.navigateTo 跳转到注册页面
      uni.navigateTo({
        url: '/pages/index/Register'
      });
    }
  }
}
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
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
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

.login-button,
.register-button {
  width: 48%;
  padding: 10px;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover,
.register-button:hover {
  background-color: #0056b3;
}
</style>