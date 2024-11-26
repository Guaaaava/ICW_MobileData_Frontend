<template>
	<view class="container">
		<!-- 工具栏 -->
		<view class="toolbar">
			<u-select v-model="show" mode="single-column" :list="deviceSelectList" @confirm="deviceSelectConfirm"></u-select>
			<u-button @click="show = true">选择设备</u-button>
		</view>
		
		<!-- 数据图表 -->
		<view class="dashboard-cards">
			<text>时程曲线</text>
			<view class="card">
				<qiun-data-charts
					type="line"
					:opts="timeChartOpts"
					:chartData="timeChartData"
					:loadingType=0
				/>
			</view>
			<text>频谱曲线</text>
			<view class="card">
				<qiun-data-charts
					type="line"
					:opts="amplitudeChartOpts"
					:chartData="amplitudeChartData"
					:loadingType=0
				/>
			</view>
		</view>
		
		<!-- X、Y、Z 轴切换按钮 -->
		<view class="axis-buttons">
			<u-button class="axis-button" @click="changeAxis('left')">{{ axisOrder[(curAxisIndex + 2) % 3] }}</u-button>
			<u-button class="axis-button" @click="changeAxis('right')">{{ axisOrder[(curAxisIndex + 1) % 3] }}</u-button>
		</view>
		
	</view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref, watch } from 'vue';
import axios from 'axios';

/*-- 设备信息接口		--
	-- 数据来源：后端数据库 --*/
interface Device {
  deviceName: string;
  deviceId: string;
  offset: number | string;
  lowerOuliter: number | string;
  higherOuliter: number | string;
}

/*-- 当前建筑设备信息接口 --
	-- 数据来源：后端数据库 --*/
interface DeviceInfo {
	deviceName: string;
	deviceId: string;
	disabled: boolean;
	online: boolean;
}

/*-- 当前建筑设备选项接口		--
	-- 数据来源：DeviceThisBuilding --*/
interface DeviceSelect {
	value: string;
	label: string;
}

/*-- 工具栏 		--
  -- 获取设备信息 --*/
let show = ref<boolean>(false); // 控制 select 组件的显示
let allDevices = ref<Device[]>([]); // 所有设备列表
let buildingName = ref<string>(''); // 当前建筑名称
let deviceThisBuilding = ref<DeviceInfo[]>([]); // 当前建筑的设备列表
let deviceSelectList = ref<DeviceSelect[]>([]); // 选项列表
let selectedDeviceId = ref<string>('9A0D1958'); // 初始化为'A楼03'

// 方法：从服务器获取所有设备信息
const getAllDevices = async () => {
	// const url = '';
	// try {
	// 	const response = await axios.get(url);
	// 	if (response.data) {
	// 		allDevices.value = response.data as Device[];
	// 	} else {
	// 		console.log('Warning: getAllDevices response is empty.');
	// 	}
	// } catch (error) {
	// 	console.error('Error getting all devices: ', error);
	// }
	allDevices.value = [
		{ deviceName: 'A楼01', deviceId: 'A77C5238', offset: 0, lowerOuliter: 0, higherOuliter: 0 },
		{ deviceName: 'A楼02', deviceId: 'F853ED49', offset: 0, lowerOuliter: 0, higherOuliter: 0 },
		{ deviceName: 'A楼03', deviceId: '9A0D1958', offset: 0, lowerOuliter: 0, higherOuliter: 0 },
		{ deviceName: 'A楼04', deviceId: '87C3D4E4', offset: 0, lowerOuliter: 0, higherOuliter: 0 },
		{ deviceName: 'A楼05', deviceId: '29FA1867', offset: 0, lowerOuliter: 0, higherOuliter: 0 },
		{ deviceName: 'A楼06', deviceId: 'E43AC643', offset: 0, lowerOuliter: 0, higherOuliter: 0 },
		{ deviceName: '综合楼01', deviceId: 'E884C99D', offset: 0, lowerOuliter: 0, higherOuliter: 0 },
		{ deviceName: '综合楼02', deviceId: '612B04ED', offset: 0, lowerOuliter: 0, higherOuliter: 0 },
		{ deviceName: '综合楼03', deviceId: '8361D7CD', offset: 0, lowerOuliter: 0, higherOuliter: 0 },
		{ deviceName: '综合楼04', deviceId: '8850A7D7', offset: 0, lowerOuliter: 0, higherOuliter: 0 },
		{ deviceName: '综合楼05', deviceId: '4787BE3A', offset: 0, lowerOuliter: 0, higherOuliter: 0 },
		{ deviceName: '风压', deviceId: 'F001', offset: 0, lowerOuliter: 0, higherOuliter: 0 },
	];
}

// 方法：获取当前建筑信息
// ### todo 需要从之前页面获取
const getBuildingName = () => {
	// 
	// 
	// 
	buildingName.value = '同济A楼';
}

// 方法：从服务器获取当前建筑所有设备信息
const getDeviceThisBuilding = async () => {
	// const url = '';
	// try {
	// 	const response = await axios.post(url, { query: buildingName });
	// 	if (response.data) {
	// 		deviceThisBuilding.value = response.data as DeviceInfo[];
	// 	} else {
	// 		console.log('Warning: getDeviceThisBuilding response is empty.');
	// 	}
	// } catch (error) {
	// 	console.error('Error getting device this building: ', error);
	// }
	deviceThisBuilding.value = [
		{ deviceName: 'A楼01', deviceId: 'A77C5238', disabled: true, online: false },
		{ deviceName: 'A楼02', deviceId: 'F853ED49', disabled: false, online: true },
		{ deviceName: 'A楼03', deviceId: '9A0D1958', disabled: false, online: true },
		{ deviceName: 'A楼04', deviceId: '87C3D4E4', disabled: false, online: true },
		{ deviceName: 'A楼05', deviceId: '29FA1867', disabled: true, online: false },
		{ deviceName: 'A楼06', deviceId: 'E43AC643', disabled: true, online: false },
	];
	// deviceThisBuilding.value = [
	// 	{ deviceName: '综合楼01', deviceId: 'E884C99D', disabled: true, online: false },
	// 	{ deviceName: '综合楼02', deviceId: '612B04ED', disabled: true, online: false },
	// 	{ deviceName: '综合楼03', deviceId: '8361D7CD', disabled: true, online: false },
	// 	{ deviceName: '综合楼04', deviceId: '8850A7D7', disabled: true, online: false },
	// 	{ deviceName: '综合楼05', deviceId: '4787BE3A', disabled: true, online: false },
	// ];
}

// 方法：设置设备选项
const setDeviceSelectList = () => {
	deviceThisBuilding.value.forEach((device, index) => {
		let deviceLabel = device.deviceName + '-' + device.deviceId + '-' +
											(device.disabled ? '不可用' : '可用') + '-' +
											(device.online ? '在线' : '离线');
		deviceSelectList.value.push({ value: (index+1).toString(), label: deviceLabel });
	});
}

// 方法：选择设备确认的响应
// ### todo 下次选择时初始位置应为上次选择的设备
const deviceSelectConfirm = (selectedDevice: DeviceSelect) => {
	let selectedIndex = selectedDevice[0].index;
	selectedDeviceId.value = deviceThisBuilding.value[selectedIndex].deviceId;
}

/*-- 工具函数 		--
  -- 图表X轴配置 --*/
// 方法：用于补齐零
const padZero = (num: number) => num.toString().padStart(2, '0');

// 方法：计算 X 轴，返回 time_list
const caculateTimeList = (start: number, interval: number): string[] => {
	const time_list: string[] = [];
	let i = 0;
	for(;i < 1000; i++){
	    const date = new Date(start + i * interval);
	    const hour = date.getUTCHours() + 8; // 获取小时（加 8 是为了转换为北京时间）
	    const minute = date.getUTCMinutes(); // 获取分钟
	    const second = date.getUTCSeconds(); // 获取秒钟
	
	    const beijingTimeString = `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
	    time_list.push(beijingTimeString);
	}
	return time_list;
}

/*-- 时程曲线：X 轴为时间(间隔1秒) 		--
  -- 					Y 轴为加速度大小(/gal) --*/
let timeXData = ref([]);
let timeYData = ref([]);
let timeZData = ref([]);
let timeChartData = ref([]);

// 时程曲线图表设置
const timeChartOpts = ref({
	dataLabel: false,
	update: true,
	duration: 0,
	dataPointShape: false,
	padding: [20, 30, 0, 5],
	xAxis: { axisLine: false, boundaryGap: 'justify', labelCount: 5 },
	yAxis: { gridType: 'solid', data: [{ min: -1, max: 1 }] },
	extra: { markLine: { data: [{ value: 0, showLabel: true, labelOffsetX: -10 }] } }
});

// 方法：获取时程曲线 X、Y、Z 轴数据
const getTimeData = async () => {
	// const xDataUrl = '';
	// const yDataUrl = '';
	// const zDataUrl = '';
	
	// // X 轴数据
	// try {
	// 	const response = await axios.post(xDataUrl, { query: selectedDeviceId });
	// 	if (response.data) {
	// 		let xresponse = response.data as any;
	// 		timeXData.value = JSON.parse(JSON.stringify(processTimeData(xresponse)));
	// 	} else {
	// 		console.log('Warning: getXTimeData response is empty.');
	// 	}
	// } catch (error) {
	// 	console.error('Error getting X time Data: ', error);
	// }
	// // Y 轴数据
	// try {
	// 	const response = await axios.post(yDataUrl, { query: selectedDeviceId });
	// 	if (response.data) {
	// 		let yresponse = response.data as any;
	// 		timeYData.value = JSON.parse(JSON.stringify(processTimeData(yresponse)));
	// 	} else {
	// 		console.log('Warning: getXTimeData response is empty.');
	// 	}
	// } catch (error) {
	// 	console.error('Error getting X time Data: ', error);
	// }
	// // Z 轴数据
	// try {
	// 	const response = await axios.post(zDataUrl, { query: selectedDeviceId });
	// 	if (response.data) {
	// 		let zresponse = response.data as any;
	// 		timeZData.value = JSON.parse(JSON.stringify(processTimeData(zresponse)));
	// 	} else {
	// 		console.log('Warning: getXTimeData response is empty.');
	// 	}
	// } catch (error) {
	// 	console.error('Error getting X time Data: ', error);
	// }
	//
	// timeChartData.value = timeXData.value; // 默认显示 X 轴
	
	let xresData = {};
	let yresData = {};
	let zresData = {};
	timeXData.value = JSON.parse(JSON.stringify(xresData));
	timeYData.value = JSON.parse(JSON.stringify(yresData));
	timeZData.value = JSON.parse(JSON.stringify(zresData));
	timeChartData.value = timeXData.value; // 默认显示 X 轴
}

// 方法：处理时程数据以适配图表，返回处理后数据
// ### 需要根据具体数据格式进行处理
const processTimeData = (originAxisData: any, axis: string) => {
	let timeList = caculateTimeList(originAxisData.s_date, 16);
	
	let axisData: number[] = [];
	if (axis === 'x') {
		axisData = originAxisData.x;
	} else if (axis === 'y') {
		axisData = originAxisData.y;
	} else if (axis === 'z') {
		axisData = originAxisData.z;
	}
	
	let resData = {
		categories: timeList,
		series: [ { name: '数据', data: axisData } ]
	};
	
	return resData;
}

/*-- 频谱曲线：X 轴为频率(0-63) --
	--					Y 轴为幅值 			--*/
let amplitudeXData = ref([]);
let amplitudeYData = ref([]);
let amplitudeZData = ref([]);
let amplitudeChartData = ref([]);

// 频谱曲线图表设置
const amplitudeChartOpts = ref({
	dataLabel: false,
	update: true,
	duration: 0,
	dataPointShape: false,
	padding: [20, 30, 0, 5],
	xAxis: { boundaryGap: 'justify', labelCount: 5 },
	yAxis: { gridType: 'solid', data: [{ min: 0, max: 0.06 }] }
});

// 方法：获取频谱曲线 X、Y、Z 轴数据
const getAmplitudeData = async () => {
	// const xDataUrl = '';
	// const yDataUrl = '';
	// const zDataUrl = '';
	
	// // X 轴数据
	// try {
	// 	const response = await axios.post(xDataUrl, { query: selectedDeviceId });
	// 	if (response.data) {
	// 		let xresponse = response.data as any;
	// 		amplitudeXData.value = JSON.parse(JSON.stringify(processAmpData(xresponse)));
	// 	} else {
	// 		console.log('Warning: getXAmplitudeData response is empty.');
	// 	}
	// } catch (error) {
	// 	console.error('Error getting X amplitude Data: ', error);
	// }
	// // Y 轴数据
	// try {
	// 	const response = await axios.post(yDataUrl, { query: selectedDeviceId });
	// 	if (response.data) {
	// 		let yresponse = response.data as any;
	// 		amplitudeYData.value = JSON.parse(JSON.stringify(processAmpData(yresponse)));
	// 	} else {
	// 		console.log('Warning: getXAmplitudeData response is empty.');
	// 	}
	// } catch (error) {
	// 	console.error('Error getting X amplitude Data: ', error);
	// }
	// // Z 轴数据
	// try {
	// 	const response = await axios.post(zDataUrl, { query: selectedDeviceId });
	// 	if (response.data) {
	// 		let zresponse = response.data as any;
	// 		amplitudeZData.value = JSON.parse(JSON.stringify(processAmpData(zresponse)));
	// 	} else {
	// 		console.log('Warning: getXAmplitudeData response is empty.');
	// 	}
	// } catch (error) {
	// 	console.error('Error getting X amplitude Data: ', error);
	// }
	//
	// amplitudeChartData.value = amplitudeXData.value; // 默认显示 X 轴
	
	let xresData = {};
	let yresData = {};
	let zresData = {};
	amplitudeXData.value = JSON.parse(JSON.stringify(xresData));
	amplitudeYData.value = JSON.parse(JSON.stringify(yresData));
	amplitudeZData.value = JSON.parse(JSON.stringify(zresData));
	amplitudeChartData.value = amplitudeXData.value; // 默认显示 X 轴
}

// 方法：处理频谱数据以适配图表，返回处理后数据
// ### 需要根据具体数据格式进行处理
const processAmpData = (originAxisData: any, axis: string) => {
	let intervals = originAxisData.interval;
	
	let axisData: number[] = [];
	if (axis === 'x') {
		axisData = originAxisData.x;
	} else if (axis === 'y') {
		axisData = originAxisData.y;
	} else if (axis === 'z') {
		axisData = originAxisData.z;
	}
	
	let resData = {
		categories: intervals,
		series: [ { name: '数据', data: axisData } ]
	};
	
	return resData;
}

/*-- 图表方向切换按钮 --*/
let curAxisIndex = ref<number>(0); // 从 X 轴开始
const axisOrder = ['X轴', 'Y轴', 'Z轴'];

// 方法：切换不同方向图表
const changeAxis = (direction: string) => {
	if (direction === 'left') {
	  curAxisIndex.value = (curAxisIndex.value + 2) % 3;
	} else if (direction === 'right') {
	  curAxisIndex.value = (curAxisIndex.value + 1) % 3;
	}
	
	const currentAxis = axisOrder[curAxisIndex.value];
	if (currentAxis === 'X轴') {
		timeChartData.value = timeXData.value;
		amplitudeChartData.value = amplitudeXData.value;
	} else if (currentAxis === 'Y轴') {
		timeChartData.value = timeYData.value;
		amplitudeChartData.value = amplitudeYData.value;
	} else if (currentAxis === 'Z轴') {
	  timeChartData.value = timeZData.value;
	  amplitudeChartData.value = amplitudeZData.value;
	}
}

/*-- 入口函数 --*/
onShow(() => {
	getAllDevices(); // 获取所有设备信息
	getBuildingName(); // 获取当前建筑信息
	getDeviceThisBuilding(); // 获取当前建筑所有设备信息
	setDeviceSelectList(); // 配置设备选择列表
	getTimeData(); // 获取时程曲线数据
	getAmplitudeData(); // 获取频谱曲线数据
	
	webSocketTest(); // WebSocket 测试
});

// 方法：WebSocket 测试
const webSocketTest = () => {
	const websocketUrl = 'wss://digetech.cn:8771/websocket/user_58';
	let socket1 = new WebSocket(websocketUrl);
	
	// socket请求参数1：获取设备实时状态
	const request1 = {
	  code: 2,
	  data: [ 'A77C5238', 'F853ED49', '9A0D1958', '87C3D4E4', '29FA1867', 'E43AC643' ],
	  key: 'qiushangzhou852'
	};
	// socket请求参数2：获取设备详细数据
	let request2 = {
	  code: 1,
	  data: selectedDeviceId.value,
	  channel: '0',
	  pam: 1,
	  key: 'qiushangzhou852'
	};
	
	// socket连接成功
	socket1.onopen = () => {
	  console.log('WebSocket connection1 opened');
	  // WebSocket连接成功后发送请求1——获取设备实时状态
	  socket1.send(JSON.stringify(request1));
		// WebSocket连接成功后发送请求2——获取设备详细数据
	  socket1.send(JSON.stringify(request2));
	};
	
	// 接收到socket消息
	socket1.onmessage = (event) => {
	  const message = JSON.parse(event.data);
	  if (message.code = 20001) {
	    if (message.message == '基础数据') {
	      // 时程曲线
				let xresData = processTimeData(message.data[0], 'x');
				let yresData = processTimeData(message.data[0], 'y');
				let zresData = processTimeData(message.data[0], 'z');
				timeXData.value = JSON.parse(JSON.stringify(xresData));
				timeYData.value = JSON.parse(JSON.stringify(yresData));
				timeZData.value = JSON.parse(JSON.stringify(zresData));
				timeChartData.value = timeXData.value;
				
	      // 频谱曲线
				xresData = processAmpData(message.data[1], 'x');
				yresData = processAmpData(message.data[1], 'y');
				zresData = processAmpData(message.data[1], 'z');
				amplitudeXData.value = JSON.parse(JSON.stringify(xresData));
				amplitudeYData.value = JSON.parse(JSON.stringify(yresData));
				amplitudeZData.value = JSON.parse(JSON.stringify(zresData));
				amplitudeChartData.value = amplitudeXData.value;
	    } else if (message.message == '设备状态') {
				// 更新设备选项
	    }
	  }
	};
	
	// socket错误
	socket1.onerror = (error) => {
	  console.error('WebSocket error:', error);
	};
	
	// socket关闭
	socket1.onclose = () => {
	  console.log('WebSocket connection closed');
	};
	
	// 监测设备选择变化
	watch(selectedDeviceId, (newValue) => {
	  request2.data = newValue;
	  socket1.close();
	  socket1 = new WebSocket(websocketUrl);
	  socket1.onopen = () => {
	    console.log('WebSocket connection1 reopened');
	    // WebSocket连接成功后发送请求1——获取设备实时状态
	    socket1.send(JSON.stringify(request1));
			// WebSocket连接成功后发送请求2——获取设备详细数据
	    socket1.send(JSON.stringify(request2));
	  };
	
	  // 接收到socket消息
	  socket1.onmessage = (event) => {
	    const message = JSON.parse(event.data);
	    if (message.code = 20001) {
	      if (message.message == '基础数据') {
	        // 时程曲线
	        let xresData = processTimeData(message.data[0], 'x');
	        let yresData = processTimeData(message.data[0], 'y');
	        let zresData = processTimeData(message.data[0], 'z');
	        timeXData.value = JSON.parse(JSON.stringify(xresData));
	        timeYData.value = JSON.parse(JSON.stringify(yresData));
	        timeZData.value = JSON.parse(JSON.stringify(zresData));
	        timeChartData.value = timeXData.value;
	        
	        // 频谱曲线
	        xresData = processAmpData(message.data[1], 'x');
	        yresData = processAmpData(message.data[1], 'y');
	        zresData = processAmpData(message.data[1], 'z');
	        amplitudeXData.value = JSON.parse(JSON.stringify(xresData));
	        amplitudeYData.value = JSON.parse(JSON.stringify(yresData));
	        amplitudeZData.value = JSON.parse(JSON.stringify(zresData));
	        amplitudeChartData.value = amplitudeXData.value;
	      } else if (message.message == '设备状态') {
	        // 更新设备选项
	      }
	    }
	  };
	
	  // socket错误
	  socket1.onerror = (error) => {
	    console.error('WebSocket error:', error);
	  };
	
	  // socket关闭
	  socket1.onclose = () => {
	    console.log('WebSocket connection closed');
	  };
	});
}
</script>

<style scoped>
.container {
	padding: 20px;
}

.toolbar {
	margin-bottom: 20px;
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