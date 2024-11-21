<template>
	<view class="container">
		<!-- Dashboard Toolbar -->
		<view class="toolbar">
			<u-select v-model="show" mode="single-column" :list="devices"></u-select>
			<u-button @click="show = true">选择设备</u-button>
		</view>
		
		<!-- Device Information Card -->
		<view class="device-info">
		  <view class="device-item">
		    <text class="device-label">设备名称:</text>
		    <text class="device-value">{{ selectedDevice.deviceName }}</text>
		  </view>
		  <view class="device-item">
		    <text class="device-label">设备ID:</text>
		    <text class="device-value">{{ selectedDevice.deviceId }}</text>
		  </view>
		  <view class="device-item">
		    <text class="device-label">可用:</text>
		    <text class="device-value">{{ selectedDevice.disabled === true ? '是' : '否' }}</text>
		  </view>
		  <view class="device-item">
		    <text class="device-label">在线:</text>
		    <text class="device-value">{{ selectedDevice.online === true ? '是' : '否' }}</text>
		  </view>
		</view>
		
		<!-- Dashboard Cards -->
		<view class="dashboard-cards">
			<view class="card">
				<qiun-data-charts
					type="line"
					:opts="opts"
					:chartData="currentChartData"
					:ontouch="true" 
				/>
			</view>
		</view>
		
		<!-- Axis Buttons -->
		<view class="axis-buttons">
		  <u-button class="axis-button" @click="changeAxis('left')">上一个</u-button>
		  <u-button class="axis-button" @click="changeAxis('right')">下一个</u-button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref, watch } from 'vue';

let show = ref(false);
let devices = ref([]);
let selectedDevice = ref({
  deviceId: '9A0D1958',
  deviceName: 'A楼03',
  disabled: true,
  online: true,
});

devices.value = [
	{ value: '1', label: '同济A楼03' },
	{ value: '2', label: '同济B楼04' },
	{ value: '3', label: '衷和楼' }
];

//获取设备信息
interface Device {
  deviceName: string;
  deviceId: string;
  offset: number | string;
  lowerOuliter: number | string;
  higherOuliter: number | string;
}

// 使用初始空数组并指定类型
let deviceList = ref<Device[]>([]);

const fetchDeviceList = async () => {
  // try {
  //   const response = await useFetch('/api/device/all');
  //   deviceList.value = response.data.value.data.devices as unknown as Device[];
		// console.log(deviceList.value);
  // } catch (error) {
  //   console.error('Error getting device list:', error);
  // }
	
	// 模拟获取的数据
	deviceList.value = [{
		deviceName: 'A楼03',
		deviceId: '9A0D1958',
		offset: 1,
		lowerOuliter: 1,
		higherOuliter: 1,
	}];
};

onShow(() => {
	fetchDeviceList();
	getServerData();
	show.value = false;
});

const timeCurveData = ref({});
const AmplitudeCurveData = ref({});

const XAxisData = ref({});
const YAxisData = ref({});
const ZAxisData = ref({});
const currentChartData = ref({});

const axisOrder = ['x', 'y', 'z'];
let currentAxisIndex = 0; // 默认从X轴开始

// 图标设置
const opts = ref({
	color: ["#1890FF","#91CB74","#FAC858","#EE6666"],
	padding: [15,15,0,5],
	legend: {},
	xAxis: { disableGrid: true, scrollShow: true, itemCount: 2 },
	yAxis: { gridType: "dash", dashLength: 2 },
	extra: { line: { type: "straight", width: 2, activeType: "hollow" } }
});

function getServerData() {
	// 模拟从服务器获取数据
	setTimeout(() => {
		// 模拟从服务器返回数据
		let resX = {
		  categories: ["0","1","2","3","4","5"],
		  series: [
		    { name: "数据A", data: [35,8,31,33,4,20] },
		    { name: "数据B", data: [70,40,56,100,44,60] },
		  ]
		};
		let resY = {
		  categories: ["0","1","2","3","4","5"],
		  series: [
		    { name: "数据C", data: [100,80,95,150,112,132] },
		    { name: "数据D", data: [120,110,105,160,122,142] },
		  ]
		};
		let resZ = {
		  categories: ["0","1","2","3","4","5"],
		  series: [
		    { name: "数据E", data: [50,60,70,80,90,100] },
		    { name: "数据F", data: [200,190,180,170,160,150] },
		  ]
		};
		XAxisData.value = JSON.parse(JSON.stringify(resX));
		YAxisData.value = JSON.parse(JSON.stringify(resY));
		ZAxisData.value = JSON.parse(JSON.stringify(resZ));
		currentChartData.value = XAxisData.value; // 默认显示X轴数据
	}, 500);
}

// 选择X、Y、Z轴的按钮响应函数
const changeAxis = (direction : string) => {
	if (direction === 'left') {
	  currentAxisIndex = (currentAxisIndex - 1 + axisOrder.length) % axisOrder.length;
	} else if (direction === 'right') {
	  currentAxisIndex = (currentAxisIndex + 1) % axisOrder.length;
	}
	
	const currentAxis = axisOrder[currentAxisIndex];
	if (currentAxis === 'x') {
		currentChartData.value = XAxisData.value;
	} else if (currentAxis === 'y') {
		currentChartData.value = YAxisData.value;
	} else if (currentAxis === 'z') {
    currentChartData.value = ZAxisData.value;
  }
}

</script>

<style scoped>
.container {
	padding: 20px;
}

.toolbar {
	margin-bottom: 20px;
}

.online {
	background-color: #4CAF50;
}

.offline {
	background-color: #B0BEC5;
}

.dashboard-cards {
	display: block;
	justify-content: space-between;
	gap: 20px;
	margin-bottom: 20px;
}

.card {
	border: 1px solid #E0E0E0;
	border-radius: 8px;
	margin-bottom: 10px;
}

.device-info {
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 5px;
  border-bottom: 1px solid #eaeaea;
}

.device-label {
  color: #555;
  font-weight: bold;
}

.device-value {
  color: #1890FF;
}

.device-item:last-child {
  border-bottom: none;
}

.axis-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.axis-button {
  padding: 8px 15px;
  font-size: 14px;
}
</style>