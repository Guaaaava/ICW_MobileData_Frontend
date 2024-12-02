<template>
  <view class="container">
    <view class="box">
      <!-- 选择台阵 -->
      <picker mode="selector" :range="array" @change="onPickerChange">
        <view class="picker">
          台阵选择：{{ array[selectedIndex] }}
        </view>
      </picker>
      <!-- 方向选择 -->
      <picker mode="selector" :range="['X', 'Y', 'Z']" @change="onDirectionPickerChange">
        <view class="picker">
          方向选择：{{ ['X', 'Y', 'Z'][directionIndex] }}
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
      uni.navigateTo({
        url: '/pages/index/index04'
      });
    }
  }
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  background-color: #f0f4f8;
}

.box {
  width: 90%;
  max-width: 400px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.picker {
  padding: 8px;
  border: 1px solid #cccccc;
  margin-bottom: 15px;
  border-radius: 5px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
  margin-right: 10px;
  color: #333333;
}

.value {
  color: #666666;
}

.input-field {
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 8px;
  margin-right: 10px;
  flex-grow: 1;
}

.scale-control {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.scale-label {
  margin-right: 10px;
  font-size: 16px;
  color: #333333;
}

.scale-text {
  margin: 0 10px;
  font-weight: bold;
  color: #333333;
}

.scale-button {
  background-color: #4a90e2;
  border: none;
  padding: 2px 5px;
  border-radius: 5px;
  cursor: pointer;
  color: white;
}

.scale-button:hover {
  background-color: #357ab8;
}

.confirm-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 2px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
  display: flex;
  align-items: center;
}

.confirm-button:hover {
  background-color: #357ab8;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.blue-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
  margin: 0 5px;
  display: flex;
  align-items: center;
}

.blue-button:hover {
  background-color: #357ab8;
}

.green-button {
  background-color: #e2bcb1;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
  margin: 0 5px;
  display: flex;
  align-items: center;
}

.green-button:hover {
  background-color: #357ab8;
}
</style>