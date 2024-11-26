<template>
  <div class="device-list">
    <button
      v-for="(device, index) in devices" 
      :key="index" 
      class="device-button"
      :class="{'available': isAvailable(index), 'selected': isSelected(index)}"
      @click="selectDevice(index)"
      :disabled="!isAvailable(index)"
    >
      {{ device.location }}
    </button>
    <button class="confirm-button" @click="confirmSelection">确定</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      devices: [
        { id: 'A77C5238', location: '综合楼01' },
        { id: 'F853ED49', location: '综合楼02' },
        { id: '87C3D4E4', location: '综合楼03' },
        { id: '9A0D1958', location: '综合楼04' },
        { id: '00000000', location: '综合楼05' },
      ],
      selectedDeviceIndex: null
    };
  },
  methods: {
    isAvailable(index) {
      return index >= 1 && index <= 3; // 假设02到04是可用的
    },
    isSelected(index) {
      return this.selectedDeviceIndex === index;
    },
    selectDevice(index) {
      if (this.isAvailable(index)) {
        this.selectedDeviceIndex = index;
      }
    },
    confirmSelection() {
      uni.navigateTo({
        url: '/pages/index/BuildingA/01'
      });
    }
  }
};
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
}

.device-button.available {
  background-color: #4caf50;
  color: white;
}

.device-button.selected {
  background-color: #2196f3;
  color: white;
  transform: scale(1.05);
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirm-button:hover {
  background-color: #1976d2;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>