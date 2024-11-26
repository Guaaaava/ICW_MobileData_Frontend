<template>
  <div class="device-list">
    <div v-for="(device, index) in devices" :key="index" class="device" :class="{'available': isAvailable(index), 'selected': isSelected(index)}" @click="selectDevice(index)">
      <div class="device-id">{{ device.id }}</div>
      <div class="device-location">{{ device.location }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      devices: [
        { id: 'A77C5238', location: 'A楼01' },
        { id: 'F853ED49', location: 'A楼02' },
        { id: '87C3D4E4', location: 'A楼03' },
        { id: '9A0D1958', location: 'A楼04' },
        { id: '00000000', location: 'A楼05' }, // 假设05和06不可用
        { id: '00000000', location: 'A楼06' }
      ],
      selectedDevices: []
    };
  },
  methods: {
    isAvailable(index) {
      return index >= 1 && index <= 3; // 假设02到04是可用的
    },
    isSelected(index) {
      return this.selectedDevices.includes(index);
    },
    selectDevice(index) {
      if (this.isAvailable(index)) {
        const selectedDevices = this.selectedDevices.slice();
        const existingIndex = selectedDevices.indexOf(index);
        if (existingIndex > -1) {
          selectedDevices.splice(existingIndex, 1);
        } else {
          selectedDevices.push(index);
        }
        this.selectedDevices = selectedDevices;
      }
    }
  }
};
</script>

<style scoped>
.device-list {
  display: flex;
  flex-direction: column;
}

.device {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  cursor: pointer;
}

.device-id {
  font-weight: bold;
  margin-right: 10px;
}

.available {
  background-color: #e0f7fa; /* 浅绿色背景 */
}

.selected {
  border-color: #4caf50; /* 绿色边框 */
}

.device-location {
  color: #333;
}
</style>