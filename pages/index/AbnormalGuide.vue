<template>
  <view class="exception-container">
    <text class="exception-prompt">您希望查看哪个建筑的异常数据</text>
    <view class="building-box">
      <view v-for="building in buildings" :key="building.buildingId" class="building-item" @click="goToBuilding(building.buildingId)">
        <image :src="building.imageUrl" mode="aspectFill" class="building-image"></image>
        <view class="building-name">{{ building.name }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      buildings: [] // 用于存储从API获取的建筑数据
    };
  },
  methods: {
    fetchBuildings() {
      const url = 'http://110.42.214.164:8003/building';
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.code === 200 && data.data) {
            this.buildings = data.data;
          }
        })
        .catch(error => {
          console.error('Error fetching buildings:', error);
        });
    },
    goToBuilding(buildingId) {
      const url = `/pages/abnormal/Building${buildingId}`;
      uni.navigateTo({
        url
      });
    }
  },
  mounted() {
    this.fetchBuildings(); // 在组件挂载时获取建筑数据
  }
}
</script>

<style scoped>
.exception-container {
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

.exception-container:hover {
  background: linear-gradient(-135deg, #74b9ff, #ff8c00);
}

.exception-prompt {
  font-size: 1.5em;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
  animation: moveIn 0.5s ease-out forwards;
}

.exception-button {
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

.exception-button::before {
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

.exception-button:hover::before {
  top: -10%;
  left: -10%;
}

.exception-button:hover {
  background-color: rgba(0, 123, 255, 1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.exception-button:active {
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

.building-container {
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

.prompt {
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
}

.building-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
}

.building-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.building-item:hover {
  transform: translateY(-5px);
}

.building-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.building-name {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
</style>