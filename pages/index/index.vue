<template>
	<view class="container">
		<!-- 工具栏 -->
		<view class="toolbar">
			<u-select
				v-model="show"
				mode="single-column"
				:list="deviceSelectList"
				:default-value=[selectedDeviceIndex]
				@confirm="deviceSelectConfirm"
			></u-select>
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
import { onShow, onHide, onUnload } from '@dcloudio/uni-app';
import { ref } from 'vue';
import axios from 'axios';

/*-- 设备信息接口		--
	-- 数据来源：后端数据库 --*/
interface Device {
	sensorId: number; // 传感器 ID
	device: string;		// 设备编号
	building: string; // 建筑名称（例：综合楼）
	number: string;		// 设备序号（例：05）
	status: string;		// 设备状态（1-可用，2-不可用）
	createdAt: string;// 创建时间（例：2024-11-05 14:30:00）
	updatedAt: string;// 更新时间（例：2024-11-18 09:45:00）
}

/*-- 当前建筑设备选项接口		--
	-- 数据来源：DeviceThisBuilding --*/
interface DeviceSelect {
	value: string;
	label: string;
}

/*-- 时程数据异常值存储接口 --*/
interface ExceptionTimeData {
	time: number;				// 时间戳
	direction: string;	// 方向
	device: string;			// 设备ID
	data: number;				// 数据
	urgency: number;		// 倍率
}

/*-- 频谱数据异常值存储接口 --*/
interface ExceptionAmpData {
	time: number;								// 时间戳
	direction: string;					// 方向
	device: string;							// 设备ID
	frequency_interval: number;	// 频率区间
	data: number;								// 数据
	urgency: number;						// 倍率
}

/*-- 工具栏 		--
  -- 获取设备信息 --*/
let show = ref<boolean>(false); // 控制 select 组件的显示
let allDevices = ref<Device[]>([]); // 所有设备列表
let buildingName = ref<string>(''); // 当前建筑名称
let deviceThisBuilding = ref<Device[]>([]); // 当前建筑的设备列表
let deviceSelectList = ref<DeviceSelect[]>([]); // 选项列表
let selectedDeviceId = ref<string>(''); // 选择的设备ID
let selectedDeviceIndex = ref<number>(0); // 选择的设备在选项列表中的下标

// 方法：从服务器获取所有设备信息
const getAllDevices = async () => {
	const url = 'http://110.42.214.164:8003/sensor';
	try {
		const response = await axios.get(url);
		if (response.data.msg === 'success') {
			allDevices.value = response.data.data as Device[];
			// console.log('AllDevices.value: ', allDevices.value);
		} else {
			console.log('Warning: getAllDevices responds failed.');
		}
	} catch (error) {
		console.error('Error getting all devices: ', error);
	}
	
	/*-- 示例数据 --
	allDevices.value = [
		{
		  sensorId: 1,
		  device: '87C3D4E4',
		  building: 'A楼',
		  number: '04',
		  status: '1',
		  createdAt: '2024-11-01 10:00:00',
		  updatedAt: '2024-11-01 10:00:00'
		},
		{
		  sensorId: 2,
		  device: 'F3A2B1C0',
		  building: 'B楼',
		  number: '07',
		  status: '0',
		  createdAt: '2024-11-05 14:30:00',
		  updatedAt: '2024-11-18 09:45:00'
		},
	];
	---------------*/
}

// 方法：获取当前建筑信息
// ### todo 需要从之前页面获取
const getBuildingName = () => {
	// 
	// 
	// 
	buildingName.value = 'A楼';
}

// 方法：获取当前设备信息
// ### todo 需要从之前页面获取
const getSelectedDeviceId = () => {
	// 
	// 
	// 
	selectedDeviceId.value = 'F853ED49';
}

// 方法：获取当前方向信息
// ### todo 需要从之前页面获取
const getSelectedAxis = () => {
	// 
	// 
	// 
	curAxisIndex.value = 0;
}

// 方法：从服务器获取当前建筑所有设备信息
const getDeviceThisBuilding = async () => {
	const url = `http://110.42.214.164:8003/sensor/${encodeURIComponent(buildingName.value)}`;
	try {
		const response = await axios.get(url);
		if (response.data.msg === 'success') {
			deviceThisBuilding.value = response.data.data as Device[];
			setDeviceSelectList(); // 获取到数据后，立即配置设备选择列表（解决设备列表有时为空的Bug）
			selectedDeviceIndex.value = findSelectedDeviceIndex(selectedDeviceId.value); // 立即设置默认选项
			// console.log('DeviceThisBuilding.value: ', deviceThisBuilding.value);
		} else {
			console.log('Warning: getDeviceThisBuilding responds failed.');
		}
	} catch (error) {
		console.error('Error getting device this building: ', error);
	}
	
	/*-- 示例数据 --
	allDevices.value = [
		{
		  sensorId: 1,
		  device: '87C3D4E4',
		  building: 'A楼',
		  number: '04',
		  status: '1',
		  createdAt: '2024-11-01 10:00:00',
		  updatedAt: '2024-11-01 10:00:00'
		},
		{
		  sensorId: 2,
		  device: 'F3A2B1C0',
		  building: 'B楼',
		  number: '07',
		  status: '0',
		  createdAt: '2024-11-05 14:30:00',
		  updatedAt: '2024-11-18 09:45:00'
		},
	];
	---------------*/
}

// 方法：设置设备选项
const setDeviceSelectList = () => {	
	deviceSelectList.value.length = 0; // 先清空原列表
	
	deviceThisBuilding.value.forEach((device, index) => {
		let deviceLabel = device.building + device.number + '-' + device.device + '-' +
											(device.status === '1' ? '可用' : '不可用');
		deviceSelectList.value.push({ value: (index+1).toString(), label: deviceLabel });
		// 示例选项：A楼04-87C3D4E4-可用
	});
	
	// // Bug：有时设备列表会为空
	// // Solution：在获取到数据后立即配置列表（获取函数是异步的，可能配置在获取之前进行了）
	// if (deviceSelectList.value.length === 0) {
	// 	console.log('设备选择列表尚未初始化完毕...');
	// } else {
	// 	console.log('设备选择列表初始化完毕！');
	// }
}

// 方法：查找 selectedDeviceId 在选项列表中的索引
// 用途：确定选择列表的默认选项
// 思路：deviceThisBuilding 和 deviceSelectList 的索引相同
const findSelectedDeviceIndex = (id: string) => {
	let foundIndex = deviceThisBuilding.value.findIndex(d => d.device === id);
	return (foundIndex === -1 ? 0 : foundIndex); // 没找到时默认选择第一个
}

// 方法：选择设备确认的响应
const deviceSelectConfirm = (selectedDevice: DeviceSelect) => {
	let selectedIndex = selectedDevice[0].index;
	selectedDeviceId.value = deviceThisBuilding.value[selectedIndex].device;
	selectedDeviceIndex.value = findSelectedDeviceIndex(selectedDeviceId.value);
}

/*-- 工具函数 		--
  -- 图表X轴配置 --*/
// 方法：用于补齐零
const padZero = (num: number) => num.toString().padStart(2, '0');

// 方法：计算 X 轴，返回 time_list
const caculateTimeList = (start: number, interval: number): string[] => {
	const time_list: string[] = [];
	let i = 0;
	// 1000 条数据，每条 8ms
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

// 测试数据：11.30的数据
let timeDataStart = 1732952781107;

// 时程曲线图表设置
const timeChartOpts = ref({
	dataLabel: false,
	update: true,
	duration: 0,
	dataPointShape: false,
	padding: [20, 30, 0, 5],
	xAxis: { axisLine: false, boundaryGap: 'justify', labelCount: 6 },
	yAxis: { gridType: 'solid', data: [{ min: -0.6, max: 0.6 }] },
	extra: { markLine: { data: [{ value: 0, showLabel: true, labelOffsetX: -10 }] } }
});

// 方法：获取时程曲线 X、Y、Z 轴数据
const getTimeData = async () => {
	// const timeStamp = Date.now();
	const timeStamp = timeDataStart; // 测试数据：11.30
	
	const xDataUrl = `http://110.42.214.164:8003/timeSeries/X/${timeStamp}/${selectedDeviceId.value}`;
	const yDataUrl = `http://110.42.214.164:8003/timeSeries/Y/${timeStamp}/${selectedDeviceId.value}`;
	const zDataUrl = `http://110.42.214.164:8003/timeSeries/Z/${timeStamp}/${selectedDeviceId.value}`;
	
	// X 轴数据
	try {
		const response = await axios.get(xDataUrl);
		if (response.data.msg === 'success') {
			let xresponse = response.data.data as any;
			timeXData.value = JSON.parse(JSON.stringify(processTimeData(xresponse)));
			checkTimeData(xresponse); // 检查异常值并警报
		} else {
			console.log('Warning: getXTimeData responds failed.');
		}
	} catch (error) {
		console.error('Error getting X time Data: ', error);
	}
	// Y 轴数据
	try {
		const response = await axios.get(yDataUrl);
		if (response.data.msg === 'success') {
			let yresponse = response.data.data as any;
			timeYData.value = JSON.parse(JSON.stringify(processTimeData(yresponse)));
			checkTimeData(yresponse); // 检查异常值并警报
		} else {
			console.log('Warning: getYTimeData responds failed.');
		}
	} catch (error) {
		console.error('Error getting Y time Data: ', error);
	}
	// Z 轴数据
	try {
		const response = await axios.get(zDataUrl);
		if (response.data.msg === 'success') {
			let zresponse = response.data.data as any;
			timeZData.value = JSON.parse(JSON.stringify(processTimeData(zresponse)));
			checkTimeData(zresponse); // 检查异常值并警报
		} else {
			console.log('Warning: getZTimeData responds failed.');
		}
	} catch (error) {
		console.error('Error getting Z time Data: ', error);
	}
	
	// 根据选择的方向配置数据
	if (curAxisIndex.value === 0) {
		timeChartData.value = timeXData.value;
	} else if (curAxisIndex.value === 1) {
		timeChartData.value = timeYData.value;
	} else if (curAxisIndex.value === 2) {
		timeChartData.value = timeZData.value;
	}
	
	timeDataStart += 1000; // 每一次执行增加一秒
}

// 方法：处理时程数据以适配图表，返回处理后数据
const processTimeData = (originalData: any) => {
	let timeList = caculateTimeList(originalData.sdata, 8); // 每 8ms 一条数据
	
	let resData = {
		categories: timeList,
		series: [ { name: originalData.direction + '轴', data: originalData.data } ]
	};
	
	return resData;
}

/*-- 频谱曲线：X 轴为频率(0-63) --
	--					Y 轴为幅值 			--*/
let amplitudeXData = ref([]);
let amplitudeYData = ref([]);
let amplitudeZData = ref([]);
let amplitudeChartData = ref([]);

// 测试数据：11.30的数据
let ampDataStart = 1732952781107;

// 频谱曲线图表设置
const amplitudeChartOpts = ref({
	dataLabel: false,
	update: true,
	duration: 0,
	dataPointShape: false,
	padding: [20, 30, 0, 5],
	xAxis: { boundaryGap: 'justify', labelCount: 6 },
	yAxis: { gridType: 'solid', data: [{ min: 0, max: 0.06 }] }
});

// 方法：获取频谱曲线 X、Y、Z 轴数据
const getAmplitudeData = async () => {
	// const timeStamp = Date.now();
	const timeStamp = ampDataStart; // 测试数据：11.30
	
	const xDataUrl = `http://110.42.214.164:8003/frequency/X/${timeStamp}/${selectedDeviceId.value}`;
	const yDataUrl = `http://110.42.214.164:8003/frequency/Y/${timeStamp}/${selectedDeviceId.value}`;
	const zDataUrl = `http://110.42.214.164:8003/frequency/Z/${timeStamp}/${selectedDeviceId.value}`;
	
	// X 轴数据
	try {
		const response = await axios.get(xDataUrl);
		if (response.data.msg === 'success') {
			let xresponse = response.data.data as any;
			amplitudeXData.value = JSON.parse(JSON.stringify(processAmpData(xresponse)));
			checkAmpData(xresponse); // 检查异常值并警报
		} else {
			console.log('Warning: getXAmplitudeData respond failed.');
		}
	} catch (error) {
		console.error('Error getting X amplitude Data: ', error);
	}
	// Y 轴数据
	try {
		const response = await axios.get(yDataUrl);
		if (response.data.msg === 'success') {
			let yresponse = response.data.data as any;
			amplitudeYData.value = JSON.parse(JSON.stringify(processAmpData(yresponse)));
			checkAmpData(yresponse); // 检查异常值并警报
		} else {
			console.log('Warning: getYAmplitudeData responds failed.');
		}
	} catch (error) {
		console.error('Error getting Y amplitude Data: ', error);
	}
	// Z 轴数据
	try {
		const response = await axios.get(zDataUrl);
		if (response.data.msg === 'success') {
			let zresponse = response.data.data as any;
			amplitudeZData.value = JSON.parse(JSON.stringify(processAmpData(zresponse)));
			checkAmpData(zresponse); // 检查异常值并警报
		} else {
			console.log('Warning: getZAmplitudeData responds failed.');
		}
	} catch (error) {
		console.error('Error getting Z amplitude Data: ', error);
	}
	
	// 根据选择的方向配置数据
	if (curAxisIndex.value === 0) {
		amplitudeChartData.value = amplitudeXData.value;
	} else if (curAxisIndex.value === 1) {
		amplitudeChartData.value = amplitudeYData.value;
	} else if (curAxisIndex.value === 2) {
		amplitudeChartData.value = amplitudeZData.value;
	}
	
	ampDataStart += 1000; // 每执行一次增加一秒
}

// 方法：处理频谱数据以适配图表，返回处理后数据
const processAmpData = (originalData: any) => {
	let intervals = originalData.frequencyInterval;
	
	let resData = {
		categories: intervals,
		series: [ { name: originalData.direction + '轴', data: originalData.data } ]
	};
	
	return resData;
}

/*-- 图表方向切换按钮 --*/
let curAxisIndex = ref<number>(0); // 0-x，1-y，2-z
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

/*-- 数据阈值与警报 --
	--	存储异常数据		--*/
let timeDataThreshold: number = 1; // 时程数据异常值（加速度）
let ampDataThreshold: number = 1; // 频谱数据异常值（幅值）

// 方法：获取设置的异常数据阈值
// ### todo 需要从之前页面获取
const getDataThreshold = () => {
	//
	//
	//
	timeDataThreshold = 1;
	ampDataThreshold = 1;
}
	
// 方法：检查超出阈值的时程数据，计算倍率，进行存储和警报
// 调用：在每次获取数据时调用
const checkTimeData = (originalData: any) => {
	originalData.data.forEach((t_data: number, index: number) => {
		if (t_data > timeDataThreshold) {
			// 计算倍率
			let ratio: number = t_data / timeDataThreshold;
			
			// 存储异常值
			let exceptionTimeData: ExceptionTimeData = {
				time: originalData.sdata + index * 8,
				direction: originalData.direction,
				device: originalData.device,
				data: t_data,
				urgency: ratio
			}
			saveExceptionTimeData(exceptionTimeData);
			
			// 根据倍率发出警报
			// ### todo 如何发出警报？
		}
	});
}

// 方法：通过 post 存储异常时程数据
// 类型：异步函数
const saveExceptionTimeData = async (exceptionData: ExceptionTimeData) => {
	const url = 'http://110.42.214.164:8003/TimeAnomaly';
	
	try {
		const response = await axios.post(url, exceptionData);
		if (response.data.msg === 'success') {
			console.log('Successfully uploaded time exceptional data.');
		}
	} catch (error) {
		console.error('Error post time excetional data: ', error);
	}
}

// 方法：检查超出阈值的频谱数据，计算倍率，进行存储和警报
// 调用：在每次获取数据时调用
const checkAmpData = (originalData: any) => {
	originalData.data.forEach((a_data: number, index: number) => {
		if (a_data > ampDataThreshold) {
			// 计算倍率
			let ratio: number = a_data / ampDataThreshold;
			
			// 存储异常值
			let exceptionAmpData: ExceptionAmpData = {
				time: originalData.fdata, // 频谱默认传回结束时间
				direction: originalData.direction,
				device: originalData.device,
				frequency_interval: originalData.frequencyInterval[index],
				data: a_data,
				urgency: ratio
			}
			saveExceptionAmpData(exceptionAmpData);
			
			// 根据倍率发出警报
			// ### todo 如何发出警报？
		}
	});
}

// 方法：通过 post 存储异常频谱数据
// 类型：异步函数
const saveExceptionAmpData = async (exceptionData: ExceptionAmpData) => {
	const url = 'http://110.42.214.164:8003/SpectrumAnomaly';
	
	try {
		const response = await axios.post(url, exceptionData);
		if (response.data.msg === 'success') {
			console.log('Successfully uploaded amplitude exceptional data.');
		}
	} catch (error) {
		console.error('Error post amplitude excetional data: ', error);
	}
}

/*-- 定时器 --*/
let timeDataIntervalId: NodeJS.Timeout;
let ampDataIntervalId: NodeJS.Timeout;
let timeDataInterval: number = 1000;
let ampDataInterval: number = 1000;

/*-- 入口函数 --*/
onShow(() => {
	getAllDevices(); // 获取所有设备信息
	getBuildingName(); // 获取当前建筑信息
	getSelectedDeviceId(); // 获取选择的设备信息
	getDeviceThisBuilding(); // 获取当前建筑所有设备信息，并立即配置设备选择列表
	getSelectedAxis(); // 获取选择的方向
	
	// getTimeData();
	// getAmplitudeData();
	timeDataIntervalId = setInterval(getTimeData, timeDataInterval); // 获取时程曲线数据（每秒）
	ampDataIntervalId = setInterval(getAmplitudeData, ampDataInterval); // 获取频谱曲线数据（每秒）
});

/*-- 隐藏页面 --*/
onHide(() => {
	clearInterval(timeDataIntervalId); // 清理时程曲线定时器
	clearInterval(ampDataIntervalId); // 清理频谱曲线定时器
});

/*-- 卸载页面 --*/
onUnload(() => {
	clearInterval(timeDataIntervalId); // 清理时程曲线定时器
	clearInterval(ampDataIntervalId); // 清理频谱曲线定时器
});
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