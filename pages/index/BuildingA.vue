<template>
  <view class="monitoring-container">
    <view class="prompt">请选择所要查看的监测点</view>
    <view class="monitoring-box">
      <view class="monitoring-item" v-for="point in monitoringPoints" :key="point" @click="goToDetail(point)">
        <view class="monitoring-name">{{ point }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      monitoringPoints: ['A', 'B', 'C', 'D', 'E', 'F']
    };
  },
  methods: {
    goToDetail(point) {
      const url = `/pages/index/BuildingA/${point}`;
      uni.navigateTo({
        url
      });
    }
  }
}
</script>

<style>
.monitoring-container {
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

.monitoring-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.monitoring-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  width: 80px;
  height: 100px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.monitoring-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.monitoring-name {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
</style>