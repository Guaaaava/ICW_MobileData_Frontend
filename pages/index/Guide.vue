<template>
  <view class="welcome-container">
    <text class="welcome-message">欢迎用户 yaoyao！</text>
    <text class="prompt">请您选择所要查看的数据</text>
    <button class="button" @click="navigateToDataPage1">查看实时数据图表</button>
    <button class="button" @click="navigateToDataPage2">查看历史异常数据</button>
  </view>
</template>

<script>
export default {
  methods: {
    navigateToDataPage1() {
      uni.navigateTo({
        url: '/pages/index/SelectBuilding'
      });
    },
    navigateToDataPage2() {
      uni.navigateTo({
        url: '/pages/abnormal/AbnormalGuide'
      });
    }
  }
}
</script>

<style scoped>
.welcome-container {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #74b9ff, #ff8c00);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 100vh;
  justify-content: center;
  text-align: center;
  transition: background 0.3s ease-in-out;
}

.welcome-container:hover {
  background: linear-gradient(-135deg, #74b9ff, #ff8c00);
}

.welcome-message {
  font-size: 2.5em;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  animation: moveIn 0.5s ease-out forwards;
}

.prompt {
  font-size: 1.2em;
  color: #fff;
  opacity: 0.8;
  margin-bottom: 40px;
  animation: moveIn 0.5s ease-out forwards;
  animation-delay: 0.5s;
}

.button {
  padding: 15px 30px;
  font-size: 1.1em;
  color: #fff;
  background-color: rgba(255, 176, 215, 0.8);
  border: none;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  position: relative;
  overflow: hidden;
  user-select: none;
}

.button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background: rgba(255, 255, 255, 0.1);
  transform: translate(-50%, -50%) rotate(45deg);
  transition: all 1s ease;
  z-index: 1;
}

.button:hover::before {
  top: -10%;
  left: -10%;
}

.button:hover {
  background-color: rgba(0, 123, 255, 1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.button:active {
  transform: scale(0.98);
}

@keyframes moveIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>