<template>
  <view class="building-container">
    <view class="prompt">请选择所要查看的建筑</view>
    <view class="building-box">
      <view class="building-item" @click="goToBuilding('A')">
        <image src="@/static/logo.png" mode="aspectFill" class="building-image"></image>
        <view class="building-name">同济大厦A楼</view>
      </view>
      <view class="building-item" @click="goToBuilding('B')">
        <image src="@/static/logo.png" mode="aspectFill" class="building-image"></image>
        <view class="building-name">同济大学衷和楼</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goToBuilding(building) {
      const url = building === 'A' ? '/pages/index/BuildingA' : '/pages/index/BuildingB';
      uni.navigateTo({
        url
      });
    }
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