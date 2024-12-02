<template>
  <view class="building-container">
    <view class="prompt">请选择检测设备所在的建筑</view>
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
      const url = `/pages/index/Building${buildingId}`;
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

<style>
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