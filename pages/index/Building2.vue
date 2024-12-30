<template>
  <div class="device-list">
    <!-- 提示语 -->
    <div class="prompt-message">
      请您选择<span class="highlight">A楼</span>的设备:
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
      <!-- 在不可用的按钮上添加覆盖整个按钮的× -->
      <span v-if="sensor.status === '0'" class="unavailable-indicator">X</span>
    </button>
	<div class="unavailable-message">
	  标红设备暂时不可用
	</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sensors: [],
      selectedSensorId: null,
    };
  },
  methods: {
    fetchSensors() {
      const building = 'A楼';
      const encodedBuilding = encodeURIComponent(building);
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
        uni.navigateTo({
          url: `/pages/index/SensorDetail${this.selectedSensorId}?device=${sensor.device}`
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

.prompt-message {
  margin-bottom: 20px;
  font-size: 18px;
}

.highlight {
  color: #ff8f33; /* 强调A楼的颜色 */
  font-weight: bold;
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

.unavailable-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 0, 0, 0.5); /* 半透明红色背景 */
  color: white;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 提示框样式 */
.unavailable-message {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  text-align: center;
}
</style>