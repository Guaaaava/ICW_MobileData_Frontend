<template>
  <view class="container">
    <view class="box">
      <!-- 选择台阵 -->
      <picker mode="selector" :range="array" @change="onPickerChange">
        <view class="picker">
          <text class="picker-label">台阵选择：</text>
          <text class="picker-value">{{ array[selectedIndex] }}</text>
        </view>
      </picker>
      <!-- 方向选择 -->
      <picker mode="selector" :range="['X', 'Y', 'Z']" @change="onDirectionPickerChange">
        <view class="picker">
          <text class="picker-label">方向选择：</text>
          <text class="picker-value">{{ ['X', 'Y', 'Z'][directionIndex] }}</text>
        </view>
      </picker>
      <!-- 台阵名称 -->
      <view class="input-group">
        <text class="label">台阵名称：</text>
        <text class="value">用户【幕墙振动监测】</text>
      </view>
      <!-- 台阵位置 -->
      <view class="input-group">
        <text class="label">台阵位置：</text>
        <text class="value">上海市-市辖区-杨浦区</text>
      </view>
      <!-- 测点数量 -->
      <view class="input-group">
        <text class="label">测点数量：</text>
        <text class="value">12个</text>
      </view>
      <!-- Y轴缩放 -->
      <view class="scale-control">
        <text class="scale-label">Y轴缩放：</text>
        <button class="scale-button" @click="decreaseScale">-</button>
        <text class="scale-text">{{ scale }}%</text>
        <button class="scale-button" @click="increaseScale">+</button>
      </view>
      <!-- 限值设置 -->
      <view class="input-group">
        <text class="label">限值：</text>
        <input type="number" v-model="limitValue" class="input-field" />
        <button class="confirm-button" @click="confirmLimit">确认</button>
      </view>
      
      <!-- 按钮组 -->
      <view class="button-group">
        <button class="blue-button" @click="togglePeak">关闭峰值</button>
        <button class="blue-button" @click="toggleValid">关有效值</button>
        <button class="green-button" @click="goToSelectDevice">查看曲线</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      array: ['用户【幕墙振动检测】', '用户【幕墙振动应变】'],
      selectedIndex: 0,
      directionIndex: 0,
      scale: 2,
      limitValue: '',
      gainValue: '',
      deviceSearch: ''
    };
  },
  methods: {
    onPickerChange(e) {
      this.selectedIndex = e.detail.value;
    },
    onDirectionPickerChange(e) {
      this.directionIndex = e.detail.value;
    },
    increaseScale() {
      this.scale = this.scale + 1 > 100 ? 100 : this.scale + 1;
    },
    decreaseScale() {
      this.scale = this.scale - 1 < 0 ? 0 : this.scale - 1;
    },
    confirmLimit() {
      // 确认限值逻辑
    },
    confirmGain() {
      // 确认增益系数逻辑
    },
    confirmSearch() {
      // 确认设备查找逻辑
    },
    togglePeak() {
      // 关闭峰值逻辑
    },
    toggleValid() {
      // 关闭有效值逻辑
    },
    goToSelectDevice() {
        const directions = ['X', 'Y', 'Z'];
        const selectedDirection = directions[this.directionIndex];
        uni.navigateTo({
          url: `/pages/index/index02?direction=${selectedDirection}`
        });
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  background-color: #f5f7fa;
}

.box {
  width: 100%;
  max-width: 450px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.picker {
  padding: 12px;
  border: 1px solid #d1d8e1;
  margin-bottom: 20px;
  border-radius: 8px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fafafa;
}

.picker-label {
  color: #666666;
}

.picker-value {
  font-weight: bold;
  color: #4a90e2;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.label {
  font-weight: bold;
  margin-right: 12px;
  color: #333333;
}

.value {
  color: #888888;
  font-size: 14px;
}

.input-field {
  border: 1px solid #d1d8e1;
  border-radius: 8px;
  padding: 10px;
  margin-right: 10px;
  flex-grow: 1;
  font-size: 14px;
}

.scale-control {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.scale-label {
  margin-right: 12px;
  font-size: 16px;
  color: #333333;
}

.scale-text {
  margin: 0 15px;
  font-weight: bold;
  color: #333333;
}

.scale-button {
  background: linear-gradient(145deg, #4a90e2, #357ab8);
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1), -2px -2px 5px rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease-in-out;
}

.scale-button:hover {
  transform: scale(1.1);
}

.confirm-button {
  background: linear-gradient(145deg, #4a90e2, #357ab8);
  color: white;
  border: none;
  padding: 6px 18px;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
  display: flex;
  align-items: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1), -2px -2px 5px rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease-in-out;
}

.confirm-button:hover {
  transform: scale(1.1);
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.blue-button {
  background: linear-gradient(145deg, #4a90e2, #357ab8);
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
  flex: 1;
  margin: 0 8px;
  display: flex;
  align-items: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1), -2px -2px 5px rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.3s ease;
}

.blue-button:hover {
  transform: scale(1.1);
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
}

.green-button {
  background: linear-gradient(145deg, #e2bcb1, #e29f80);
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
  flex: 1;
  margin: 0 8px;
  display: flex;
  align-items: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1), -2px -2px 5px rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.3s ease;
}

.green-button:hover {
  transform: scale(1.1);
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
}
</style>
