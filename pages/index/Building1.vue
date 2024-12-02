<template>
  <div class="device-list">
	   <!-- 提示信息 -->
	      <div v-if="showUnavailableMessage" class="warning-message">
	        红色设备暂时不可用，请选择绿色设备
	      </div>
    <!-- 设备按钮 -->
    <button
      v-for="sensor in sensors"
      :key="sensor.sensorId"
      class="device-button"
      :class="{
        'available': sensor.status === '1',
        'unavailable': sensor.status === '0',
        'scale-110': sensor.sensorId === selectedSensorId
      }"
      @click="handleSensorClick(sensor)"
    >
      {{ sensor.building }} - {{ sensor.number }}
    </button>
    <button class="confirm-button" @click="confirmSelection">进入设备具体设置</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sensors: [],
      selectedSensorId: null,
	  showUnavailableMessage: true // 控制提示信息的显示
    };
  },
  methods: {
    // 模拟请求获取传感器数据
    fetchSensors() {
      // 假设你想要传递一个 building 参数
      const building = '综合楼'; // 假设传入的参数是 A楼
      const encodedBuilding = encodeURIComponent(building); // 编码传入参数

      // 构造请求 URL
      const url = `http://110.42.214.164:8003/sensor/${encodedBuilding}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.code === 200 && data.data) {
            this.sensors = data.data;
          }
        })
        .catch(error => {
          console.error('Error fetching sensors:', error);
        });
    },
    handleSensorClick(sensor) {
      if (sensor.status === '0') {
        uni.showToast({
          title: '该设备暂时不可用',
          icon: 'none'
        });
      } else {
        this.selectedSensorId = sensor.sensorId;
        // 导航到选中的传感器详情页面
        uni.navigateTo({
          url: `/pages/index/SensorDetail/${this.selectedSensorId}`
        });
      }
    },
    confirmSelection() {
      if (this.selectedSensorId !== null) {
        uni.navigateTo({
          url: `/pages/index/SensorDetail/${this.selectedSensorId}`
        });
      }
    }
  },
  mounted() {
    this.fetchSensors();
  }
}
</script>


<style scoped>
.device-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.device-button {
  width: 200px;
  height: 60px;
  margin: 10px;
  border: none;
  border-radius: 8px;
  background-color: #e0f7fa;
  color: #333;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.device-button.available {
  background-color: #4caf50;
  color: white;
}

.device-button.unavailable {
  background-color: #ffcdd2;
  color: #333;
}

.device-button.scale-110 {
  transform: scale(1.1);
  transition: transform 0.2s;
}

.confirm-button {
  width: 200px;
  height: 60px;
  margin: 10px;
  border: none;
  border-radius: 8px;
  background-color: #e0f7fa;
  color: #333;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.confirm-button:hover {
  background-color: #1976d2;
}

/* 提示信息样式 */
.warning-message {
  padding: 10px;
  margin-bottom: 20px;
  background-color: #f44336; /* 红色背景 */
  color: white;
  font-size: 18px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
}
</style>
