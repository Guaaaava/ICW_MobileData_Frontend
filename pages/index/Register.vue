<template>
  <view class="register-container">
    <image src="@/static/logo.png" mode="widthFix" class="background-image"></image>
    <view class="back-to-login" @click="goBack">返回登录</view>
    <view class="login-box">
      <image src="@/static/logo.png" alt="Logo" class="logo"></image>
      <input type="text" placeholder="用户名" v-model="username" class="input-field" />
      <input type="password" placeholder="密码" v-model="password" class="input-field" />
      <input type="password" placeholder="请确定密码" v-model="repassword" class="input-field" />
      <view class="button-group">
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
  justify-content: center; /* 居中显示注册按钮 */
  margin-top: 10px;
}

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

.register-button:hover {
  background-color: #0056b3;
}

.back-to-login {
  position: absolute; /* 绝对定位 */
  top: 20px; /* 距离顶部20px */
  left: 20px; /* 距离左侧20px */
  padding: 10px 20px; /* 内边距 */
  background-color: #fff; /* 背景色 */
  border: 1px solid #ccc; /* 边框 */
  border-radius: 5px; /* 圆角 */
  font-size: 16px; /* 字体大小 */
  cursor: pointer; /* 鼠标样式 */
  transition: border-color 0.3s ease, background-color 0.3s ease; /* 过渡效果 */
}

.back-to-login:hover {
  border-color: #007BFF; /* 鼠标悬浮时边框颜色 */
  background-color: #f0f9ff; /* 鼠标悬浮时背景色 */
}
</style>