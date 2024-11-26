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
        <text>台阵名称：</text>
        <text>用户【幕墙振动监测】</text>
      </view>
      <!-- 台阵位置 -->
      <view class="input-group">
        <text>台阵位置：</text>
        <text>上海市-市辖区-杨浦区</text>
      </view>
      <!-- 测点数量 -->
      <view class="input-group">
        <text>测点数量：</text>
        <text>12个</text>
      </view>
      <!-- Y轴缩放 -->
      <view class="scale-control">
        <text class="scale-label">Y轴缩放：</text>
        <button @click="decreaseScale">-</button>
        <text class="scale-text">{{ scale }}%</text>
        <button @click="increaseScale">+</button>
      </view>
      <!-- 限值设置 -->
      <view class="input-group">
        <text>限值设置：</text>
        <input type="number" v-model="limitValue" class="input-field" />
        <button class="confirm-button" @click="confirmLimit">确认</button>
      </view>
      <!-- 增益系数 -->
      <view class="input-group">
        <text>增益系数：</text>
        <input type="number" v-model="gainValue" class="input-field" />
        <button class="confirm-button" @click="confirmGain">确认</button>
      </view>
      <!-- 设备查找 -->
      <view class="input-group">
        <text>设备查找：</text>
        <input type="text" v-model="deviceSearch" class="input-field" />
        <button class="confirm-button" @click="confirmSearch">确定</button>
      </view>
      <!-- 按钮组 -->
      <view class="button-group">
        <button class="blue-button" @click="togglePeak">关闭峰值</button>
        <button class="blue-button" @click="toggleValid">关闭有效值</button>
		<button class="blue-button" @click="goToSelectDevice">选择设备</button>
      </view>
    </view>
    <!-- 查看数据图表按钮 -->
    
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
      // 跳转到数据图表页面的逻辑
      uni.navigateTo({
        url: '/pages/dataChart/dataChart' // 假设数据图表页面的路径为 '/pages/dataChart/dataChart'
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
  background-color: #f5f5f5;
  position: relative; /* 相对定位，用于放置右下角按钮 */
}

.box {
  width: 90%;
  max-width: 400px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.picker {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-group text {
  margin-right: 10px;
}

.input-field {
  border: 1px solid #ccc; /* 设置输入框边框为灰色 */
  border-radius: 4px; /* 设置输入框圆角 */
  padding: 5px; /* 设置输入框内边距 */
  margin-right: 10px; /* 设置输入框与按钮之间的间距 */
  flex-grow: 1; /* 使输入框填充剩余空间 */
}

.scale-control {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.scale-label {
  margin-right: 10px; /* 设置标签与按钮之间的间距 */
  font-size: 16px; /* 设置字体大小 */
}

.scale-text {
  margin: 0 10px;
  font-weight: bold;
}

.confirm-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.confirm-button:hover {
  background-color: #0056b3;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.blue-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.blue-button:hover {
  background-color: #0056b3;
}


</style>