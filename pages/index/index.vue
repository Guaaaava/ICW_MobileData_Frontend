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
		
		<!-- 分度值选择和历史数据查看 -->
		<view class="controlbar">
			<u-radio-group v-model="degreeSelectValue">
				<u-radio
					@change="degreeRadioChange"
					v-for="(item, index) in degreeSelectList" :key="index"
					:name="item.name"
					:disabled="item.disabled"
				>
					{{ item.name }}
				</u-radio>
			</u-radio-group>
			
			<view class="last-degree-buttons">
				<u-button
					v-if="!isLastDegree && (selectedDegree === '日' || selectedDegree === '月' || selectedDegree === '年')"
					class="last-degree-button"
					@click=toLastDegree
				>←查看上一{{ selectedDegree }}</u-button>
				<u-button
					v-if="isLastDegree"
					class="last-degree-button"
					@click=toDataNow(selectedDegree)
				>回到当前{{ selectedDegree }}→</u-button>
			</view>
		</view>
		
		<!-- 数据图表 -->
		<view class="dashboard-cards">
			<view class="chart-info">
				<text v-if="!isLastDegree">
					时程曲线-{{ axisOrder[curAxisIndex] }}：峰值-{{ timeDataPV[curAxisIndex] }}，有效值-{{ timeDataRMS[curAxisIndex] }}
				</text>
				<text v-else>
					时程曲线-{{ axisOrder[curAxisIndex] }}：峰值-{{ lastTimeDataPV[curAxisIndex] }}，有效值-{{ lastTimeDataRMS[curAxisIndex] }}
				</text>
			</view>
			<view class="card">
				<qiun-data-charts
					v-if="isLoading"
				/>
				<qiun-data-charts
					v-else
					type="line"
					:opts="timeChartOpts"
					:chartData="timeChartData"
					:loadingType=0
				/>
			</view>
			
			<view class="chart-info">
				<text>频谱曲线-{{ axisOrder[curAxisIndex] }}：峰值-{{ amplitudeDataPV[curAxisIndex] }}，有效值-{{ amplitudeDataRMS[curAxisIndex] }}</text>
			</view>
			<view class="card">
				<qiun-data-charts
					v-if="isLoading"
				/>
				<qiun-data-charts
				v-else
					type="line"
					:opts="amplitudeChartOpts"
					:chartData="amplitudeChartData"
					:loadingType=0
				/>
			</view>
		</view>
		
		<!-- X、Y、Z 轴切换按钮 -->
		<view class="controlbar">
			<u-radio-group v-model="axisSelectValue">
				<u-radio
					@change="axisRadioChange"
					v-for="(item, index) in axisSelectList" :key="index"
					:name="item.name"
					:disabled="item.disabled"
				>
					{{ item.name }}
				</u-radio>
			</u-radio-group>
		</view>
		
	</view>
</template>

<script setup lang="ts">
import { onShow, onUnload } from '@dcloudio/uni-app';
import { ref } from 'vue';

/*------------------------------------------------------- 自定义接口 -------------------------------------------------------*/

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

/*-- 当前分度值选项接口	 --*/
interface DegreeSelect {
	name: string;
	disabled: boolean;
}

/*-- 当前轴选项接口	 --*/
interface AxisSelect {
	name: string;
	disabled: boolean;
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

/*------------------------------------------------------- 工具栏脚本 -------------------------------------------------------*/

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
import { GetAllDevices } from '@/request/api.js';
const getAllDevices = async () => {
	GetAllDevices()
		.then((res) => {
			// console.log('GetAllDevices response: ', res);
			allDevices.value = res.data.data as Device[];
		})
		.catch((error) => {
			console.error('Error getting all devices: ', error);
		});
	
	/*-- axios 格式 --
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
	---------------*/
	
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
import { GetDeviceThisBuilding } from '@/request/api.js';
const getDeviceThisBuilding = async () => {
	GetDeviceThisBuilding(encodeURIComponent(buildingName.value))
		.then((res) => {
			// console.log('GetDeviceThisBuilding response: ', res);
			deviceThisBuilding.value = res.data as Device[];
			setDeviceSelectList(); // 获取到数据后，立即配置设备选择列表（解决设备列表有时为空的Bug）
			selectedDeviceIndex.value = findSelectedDeviceIndex(selectedDeviceId.value); // 立即设置默认选项
		})
		.catch((error) => {
			console.error('Error getting device this building: ', error);
		});
	
	/*-- axios 格式 --
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
	---------------*/
	
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
	if (deviceThisBuilding.value[selectedIndex].status === '1') {
		selectedDeviceId.value = deviceThisBuilding.value[selectedIndex].device;
		selectedDeviceIndex.value = findSelectedDeviceIndex(selectedDeviceId.value);
	} else {
		uni.showToast({
			icon: 'error',
			duration: 1000,
			title: '该设备暂不可用'
		});
	}
}

/*------------------------------------------------------- 控制台脚本 -------------------------------------------------------*/

/*-- 控制台		--
	-- 分度值选择 --*/
let selectedDegree = ref<string>('秒');
let selectedTableName = ref<string>('time_series');
let selectedInterval = ref<number>(8); // 8ms-480ms-...
let degreeSelectList = ref<DegreeSelect[]>([
	{ name: '秒', disabled: false },
	{ name: '分', disabled: false },
	{ name: '时', disabled: false },
	{ name: '日', disabled: false },
	{ name: '月', disabled: false },
	{ name: '年', disabled: false }
]);
let degreeSelectValue = ref<string>('秒'); // 默认选择秒
let isLoading = ref<boolean>(false); // 加载中...

const secondItv = 8;
const minuteItv = 480;
const hourItv = 28800;
const dayItv = 86400;
// const monthItv = 2592000; // 1000 data
const monthItv = 2400000; // 1080 data
const yearItv = 28800000; // 1095 data

// 选中单选框时触发
const degreeRadioChange = (e: string) => {
	isLastDegree.value = false;
	selectedDegree.value = e;
	if (e === '秒') {
		selectedTableName.value = 'time_series';
		selectedInterval.value = secondItv;
	} else if (e === '分') {
		selectedTableName.value = 'time_series_minutes';
		selectedInterval.value = minuteItv;
	} else if (e === '时') {
		selectedTableName.value = 'time_series_hours';
		selectedInterval.value = hourItv;
	} else if (e === '日') {
		selectedTableName.value = 'time_series_days';
		selectedInterval.value = dayItv; // 展示一整天的数据
	} else if (e === '月') {
		selectedTableName.value = 'time_series_months';
		selectedInterval.value = monthItv; // 展示一个月的数据
	} else if (e === '年') {
		selectedTableName.value = 'time_series_years';
		selectedInterval.value = yearItv; // 展示一年的数据
	} else {
		console.error('radioChange failed!');
	}
	
	// 静态调整 y 轴缩放
	isLoading.value = true;
	setTimeout(() => {
		isLoading.value = false;
	}, 2000); // 加载 2s
	adjustTimeYAxis();
}

let isLastDegree = ref<boolean>(false); // 指示是否正在查看历史记录
let lastXData = ref([]);
let lastYData = ref([]);
let lastZData = ref([]);
let lastTimeDataRMS = ref<number[]>([0, 0, 0]); // 历史时程曲线 X、Y、Z 三轴的有效值
let lastTimeDataPV = ref<number[]>([0, 0, 0]); // 历史时程曲线 X、Y、Z 三轴的峰值

// 上一日、上一月、去年
const toLastDegree = () => {
	isLastDegree.value = true;
	
	// 加载中...
	isLoading.value = true;
	setTimeout(() => {
		isLoading.value = false;
	}, 1000); // 加载 1s
}

// 回到当前
const toDataNow = () => {
	isLastDegree.value = false;
	
	// 加载中...
	isLoading.value = true;
	setTimeout(() => {
		isLoading.value = false;
	}, 1000); // 加载 1s
}

// 获取上一个分度的时程曲线数据
const getLastTimeData = async () => {
	let timeStamp = transLastStamp(107, selectedTableName.value);
	
	// X 轴数据
	GetTimeXData(timeStamp, selectedDeviceId.value, selectedTableName.value)
		.then((res) => {
			let xresponse = res.data as any;
			lastXData.value = JSON.parse(JSON.stringify(processTimeData(xresponse)));
			lastTimeDataRMS.value[0] = parseFloat(calculateTimeRMS(xresponse.data).toFixed(6)); // 有效值保留 6 位小数
			lastTimeDataPV.value[0] = parseFloat(calculateTimePV(xresponse.data).toFixed(6)); // 峰值保留 6 位小数
		})
		.catch((error) => {
			console.error('Error getting X last Data: ' + selectedTableName.value, error);
		});
	
	// Y 轴数据
	GetTimeYData(timeStamp, selectedDeviceId.value, selectedTableName.value)
		.then((res) => {
			let yresponse = res.data as any;
			lastYData.value = JSON.parse(JSON.stringify(processTimeData(yresponse)));
			lastTimeDataRMS.value[1] = parseFloat(calculateTimeRMS(yresponse.data).toFixed(6)); // 有效值保留 6 位小数
			lastTimeDataPV.value[1] = parseFloat(calculateTimePV(yresponse.data).toFixed(6)); // 峰值保留 6 位小数
		})
		.catch((error) => {
			console.error('Error getting Y last Data: ' + selectedTableName.value, error);
		});
	
	// Z 轴数据
	GetTimeZData(timeStamp, selectedDeviceId.value, selectedTableName.value)
		.then((res) => {
			let zresponse = res.data as any;
			lastZData.value = JSON.parse(JSON.stringify(processTimeData(zresponse)));
			lastTimeDataRMS.value[2] = parseFloat(calculateTimeRMS(zresponse.data).toFixed(6)); // 有效值保留 6 位小数
			lastTimeDataPV.value[2] = parseFloat(calculateTimePV(zresponse.data).toFixed(6)); // 峰值保留 6 位小数
		})
		.catch((error) => {
			console.error('Error getting Z last Data: ' + selectedTableName.value, error);
		});
	
	// 根据选择的方向配置数据
	if (isLastDegree.value) {
		if (curAxisIndex.value === 0) {
			timeChartData.value = lastXData.value;
		} else if (curAxisIndex.value === 1) {
			timeChartData.value = lastYData.value;
		} else if (curAxisIndex.value === 2) {
			timeChartData.value = lastZData.value;
		}
	}
}

// 方法：静态修改时程曲线 y 轴缩放
const adjustTimeYAxis = () => {
	if (selectedDegree.value === '秒') {
		timeChartMin.value = -0.2;
		timeChartMax.value = 0.2;
		timeChartFormat.value = 'yAxisFix1';
	} else if (selectedDegree.value === '分') {
		timeChartMin.value = -0.03;
		timeChartMax.value = 0.03;
		timeChartFormat.value = 'yAxisFix2';
	} else if (selectedDegree.value === '时') {
		timeChartMin.value = -0.005;
		timeChartMax.value = 0.005;
		timeChartFormat.value = 'yAxisFix3';
	} else if (selectedDegree.value === '日') {
		timeChartMin.value = -0.001;
		timeChartMax.value = 0.001;
		timeChartFormat.value = 'yAxisFix4';
	} else if (selectedDegree.value === '月') {
		timeChartMin.value = -0.001;
		timeChartMax.value = 0.001;
		timeChartFormat.value = 'yAxisFix4';
	} else if (selectedDegree.value === '年') {
		timeChartMin.value = -0.0002;
		timeChartMax.value = 0.0002;
		timeChartFormat.value = 'yAxisFix5';
	} else {
		console.error('radioChange failed!');
	}
	timeChartOpts.value.yAxis.data[0].min = timeChartMin.value;
	timeChartOpts.value.yAxis.data[0].max = timeChartMax.value;
	timeChartOpts.value.yAxis.data[0].format = timeChartFormat.value;
}

/*------------------------------------------------------- 工具函数 -------------------------------------------------------*/

/*-- 工具函数 		--
  -- 图表X轴配置 --*/
// 方法：处理实时时间戳
const transformTimeStamp = (ms: number, degree: string) => {
	if (degree === 'time_series') {
		const timeNow = new Date();
		const currentHours = timeNow.getHours();
		const currentMinutes = timeNow.getMinutes();
		const currentSeconds = timeNow.getSeconds();
		const timeNew = new Date(2025, 0, 5, currentHours, currentMinutes, currentSeconds+1, ms);
		return timeNew.getTime();
	} else if (degree === 'time_series_minutes') {
		const timeNow = new Date();
		const currentYear = timeNow.getFullYear();
		const currentMonth = timeNow.getMonth();
		const currentDay = timeNow.getDate();
		const currentHours = timeNow.getHours();
		const currentMinutes = timeNow.getMinutes();
		const timeNew = new Date(currentYear, currentMonth, currentDay, currentHours, currentMinutes+1, 0, ms);
		return timeNew.getTime();
	} else if (degree === 'time_series_hours') {
		const timeNow = new Date();
		const currentYear = timeNow.getFullYear();
		const currentMonth = timeNow.getMonth();
		const currentDay = timeNow.getDate();
		const currentHours = timeNow.getHours();
		const timeNew = new Date(currentYear, currentMonth, currentDay, currentHours+1, 0, 0, ms);
		return timeNew.getTime();
	} else if (degree === 'time_series_days') {
		const timeNow = new Date();
		const currentYear = timeNow.getFullYear();
		const currentMonth = timeNow.getMonth();
		const currentDay = timeNow.getDate();
		const timeNew = new Date(currentYear, currentMonth, currentDay+1, 0, 0, 0, ms);
		return timeNew.getTime();
	} else if (degree === 'time_series_months') {
		return 1738252800000;
	} else if (degree === 'time_series_years') {
		return 1767196800000;
	}
	console.error('transformTimeStamp failed!');
	return Date.now();
}

// 方法：处理历史时间戳
const transLastStamp = (ms: number, degree: string) => {
	if (degree === 'time_series_days') {
		const timeNow = new Date();
		const currentYear = timeNow.getFullYear();
		const currentMonth = timeNow.getMonth();
		const currentDay = timeNow.getDate();
		const timeNew = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, ms);
		return timeNew.getTime();
	} else if (degree === 'time_series_months') {
		return 1735574400000;
	} else if (degree === 'time_series_years') {
		return 1735574400000;
	}
	return Date.now();
}

// 方法：用于补齐零
const padZero = (num: number) => num.toString().padStart(2, '0');

// 方法：计算 X 轴，返回 time_list
const caculateTimeList = (start: number, interval: number): string[] => {
	const time_list: string[] = [];
	let beijingTimeString: string = '';
	
	let i = 0;
	let dataNum = 1000;
	if (interval === monthItv) dataNum = 1080;
	else if (interval === yearItv) dataNum = 1095;
	// 每条 8ms-480ms-28800ms-86400ms-2400000ms-28800000ms
	for(;i < dataNum; i++){
	    const date = new Date(start + i * interval);
			const year = date.getFullYear(); // 获取年
			const month = date.getMonth() + 1; // 获取月
			const day = date.getDate(); // 获取日期
	    const hour = (date.getUTCHours() + 8) % 24; // 获取小时（加 8 是为了转换为北京时间）
	    const minute = date.getUTCMinutes(); // 获取分钟
	    const second = date.getUTCSeconds(); // 获取秒钟
			
			if (interval === secondItv) {
				beijingTimeString = `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
			} else if (interval === minuteItv) {
				beijingTimeString = `${padZero(hour)}:${padZero(minute)}`;
			} else if (interval === hourItv) {
				beijingTimeString = `${padZero(hour)}:${padZero(0)}`;
			} else if (interval === dayItv) {
				beijingTimeString = `${day}日${padZero(hour)}时`;
			} else if (interval === monthItv) {
				beijingTimeString = `${month}月${day}日`;
			} else if (interval === yearItv) {
				beijingTimeString = `${year}年${month}月`;
			}
	    
	    time_list.push(beijingTimeString);
	}
	
	return time_list;
}

/*------------------------------------------------------- 时程曲线 -------------------------------------------------------*/

/*-- 时程曲线：X 轴为时间(间隔1秒) 		--
  -- 					Y 轴为加速度大小(/gal) --*/
let timeXData = ref([]);
let timeYData = ref([]);
let timeZData = ref([]);
let timeChartData = ref([]);
let timeDataRMS = ref<number[]>([0, 0, 0]); // 时程曲线 X、Y、Z 三轴的有效值
let timeDataPV = ref<number[]>([0, 0, 0]); // 时程曲线 X、Y、Z 三轴的峰值
let timeDataThreshold = ref<number>(0.2); // 时程数据异常值（加速度），默认为 0.2
let timeChartMin = ref<number>(-0.3);
let timeChartMax = ref<number>(0.3);
let timeChartFormat = ref<string>('yAxisFix2');

// 时程曲线图表设置
let timeChartOpts = ref({
	dataLabel: false,
	update: true,
	duration: 0,
	dataPointShape: false,
	padding: [20, 30, 0, 5],
	xAxis: { axisLine: false, boundaryGap: 'justify', labelCount: 6 },
	yAxis: { gridType: 'solid', data: [{ min: timeChartMin.value, max: timeChartMax.value, format: timeChartFormat.value }] },
	extra: { markLine: { data: [
		{ value: 0, lineColor: '#000000', showLabel: true, labelOffsetX: -10 }, // 中轴标记线
		{ value: timeDataThreshold.value, lineColor: '#DE4A42', showLabel: true, labelOffsetX: -10 }, // 正阈值标记线
		{ value: -timeDataThreshold.value, lineColor: '#DE4A42', showLabel: true, labelOffsetX: -10 }, // ### Question 阈值需要负的吗？
	] } }
});

// 方法：获取时程曲线 X、Y、Z 轴数据
import { GetTimeXData, GetTimeYData, GetTimeZData } from '@/request/api.js';
const getTimeData = async () => {
	let timeStamp = transformTimeStamp(107, selectedTableName.value);
	
	// X 轴数据
	GetTimeXData(timeStamp, selectedDeviceId.value, selectedTableName.value)
		.then((res) => {
			// console.log('GetTimeXData response: ', res);
			let xresponse = res.data as any;
			timeXData.value = JSON.parse(JSON.stringify(processTimeData(xresponse)));
			timeDataRMS.value[0] = parseFloat(calculateTimeRMS(xresponse.data).toFixed(6)); // 有效值保留 6 位小数
			timeDataPV.value[0] = parseFloat(calculateTimePV(xresponse.data).toFixed(6)); // 峰值保留 6 位小数
			checkTimeData(xresponse); // 检查异常值并警报
		})
		.catch((error) => {
			console.error('Error getting X time Data: ', error);
		});
		
	
	/*-- axios 格式 --
	try {
		const response = await axios.get(xDataUrl);
		if (response.data.msg === 'success') {
			let xresponse = response.data.data as any;
			timeXData.value = JSON.parse(JSON.stringify(processTimeData(xresponse)));
			timeDataRMS.value[0] = parseFloat(xresponse.rms.toFixed(3)); // 有效值保留 3 位小数
			checkTimeData(xresponse); // 检查异常值并警报
		} else {
			console.log('Warning: getXTimeData responds failed.');
		}
	} catch (error) {
		console.error('Error getting X time Data: ', error);
	}
	---------------*/
	
	// Y 轴数据
	GetTimeYData(timeStamp, selectedDeviceId.value, selectedTableName.value)
		.then((res) => {
			// console.log('GetTimeYData response: ', res);
			let yresponse = res.data as any;
			timeYData.value = JSON.parse(JSON.stringify(processTimeData(yresponse)));
			timeDataRMS.value[1] = parseFloat(calculateTimeRMS(yresponse.data).toFixed(6)); // 有效值保留 6 位小数
			timeDataPV.value[1] = parseFloat(calculateTimePV(yresponse.data).toFixed(6)); // 峰值保留 6 位小数
			checkTimeData(yresponse); // 检查异常值并警报
		})
		.catch((error) => {
			console.error('Error getting Y time Data: ', error);
		});
	
	/*-- axios 格式 --
	try {
		const response = await axios.get(yDataUrl);
		if (response.data.msg === 'success') {
			let yresponse = response.data.data as any;
			timeYData.value = JSON.parse(JSON.stringify(processTimeData(yresponse)));
			timeDataRMS.value[1] = parseFloat(yresponse.rms.toFixed(3)); // 有效值保留 3 位小数
			checkTimeData(yresponse); // 检查异常值并警报
		} else {
			console.log('Warning: getYTimeData responds failed.');
		}
	} catch (error) {
		console.error('Error getting Y time Data: ', error);
	}
	---------------*/
	
	// Z 轴数据
	GetTimeZData(timeStamp, selectedDeviceId.value, selectedTableName.value)
		.then((res) => {
			// console.log('GetTimeZData response: ', res);
			let zresponse = res.data as any;
			timeZData.value = JSON.parse(JSON.stringify(processTimeData(zresponse)));
			timeDataRMS.value[2] = parseFloat(calculateTimeRMS(zresponse.data).toFixed(6)); // 有效值保留 6 位小数
			timeDataPV.value[2] = parseFloat(calculateTimePV(zresponse.data).toFixed(6)); // 峰值保留 6 位小数
			checkTimeData(zresponse); // 检查异常值并警报
		})
		.catch((error) => {
			console.error('Error getting Z time Data: ', error);
		});
	
	/*-- axios 格式 --
	try {
		const response = await axios.get(zDataUrl);
		if (response.data.msg === 'success') {
			let zresponse = response.data.data as any;
			timeZData.value = JSON.parse(JSON.stringify(processTimeData(zresponse)));
			timeDataRMS.value[2] = parseFloat(zresponse.rms.toFixed(3)); // 有效值保留 3 位小数
			checkTimeData(zresponse); // 检查异常值并警报
		} else {
			console.log('Warning: getZTimeData responds failed.');
		}
	} catch (error) {
		console.error('Error getting Z time Data: ', error);
	}
	---------------*/
	
	// 根据选择的方向配置数据
	if (!isLastDegree.value) {
		if (curAxisIndex.value === 0) {
			timeChartData.value = timeXData.value;
		} else if (curAxisIndex.value === 1) {
			timeChartData.value = timeYData.value;
		} else if (curAxisIndex.value === 2) {
			timeChartData.value = timeZData.value;
		}
	}
}

// 方法：处理时程数据以适配图表，返回处理后数据
const processTimeData = (originalData: any) => {
	let timeList = caculateTimeList(originalData.sdata, selectedInterval.value); // 每 8ms-480ms 一条数据
	let timeSeriesData: number[];
	
	if (!isLastDegree.value && selectedTableName.value === 'time_series_days') {
		const timeNow = new Date();
		const currentYear = timeNow.getFullYear();
		const currentMonth = timeNow.getMonth();
		const currentDay = timeNow.getDate();
		const timeDayBegin = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 107);
		const dataCount = Math.floor((timeNow.getTime() - timeDayBegin.getTime()) / dayItv);
		timeSeriesData = originalData.data.map((item: number, index: number) => (index < dataCount ? item : null));
	} else if (!isLastDegree.value && selectedTableName.value === 'time_series_months') {
		const timeNow = new Date(2025, 0, 6, 0, 0, 0, 107);
		const timeDayBegin = new Date(2025, 0, 1, 0, 0, 0, 107);
		const dataCount = Math.floor((timeNow.getTime() - timeDayBegin.getTime()) / monthItv);
		timeSeriesData = originalData.data.map((item: number, index: number) => (index < dataCount ? item : null));
	} else {
		timeSeriesData = originalData.data;
	}
	
	let resData = {
		categories: timeList,
		series: [ { name: originalData.direction + '轴', data: timeSeriesData } ]
	};
	
	return resData;
}

// 方法：计算时程数据峰值
const calculateTimePV = (data: number[]) => {
	return (data.length > 0 ? Math.max(...data) : undefined);
}

// 方法：计算时程数据有效值
// 公式：√((∑y^2)/(k+1))
const calculateTimeRMS = (data: number[]) => {
	let sqSum = 0;
	data.forEach((d: number) => {
		sqSum += d * d;
	});
	return (data.length > 0 ? Math.sqrt(sqSum / (data.length + 1)) : undefined);
}

/*------------------------------------------------------- 频谱曲线 -------------------------------------------------------*/

/*-- 频谱曲线：X 轴为频率(0-63) --
	--					Y 轴为幅值 			--*/
let amplitudeXData = ref([]);
let amplitudeYData = ref([]);
let amplitudeZData = ref([]);
let amplitudeChartData = ref([]);
let amplitudeDataRMS = ref<number[]>([0, 0, 0]); // 频谱曲线 X、Y、Z 三轴的有效值
let amplitudeDataPV = ref<number[]>([0, 0, 0]); // 频谱曲线 X、Y、Z 三轴的峰值
let ampDataThreshold = ref<number>(0.4); // 频谱数据异常值（幅值），默认为 0.4

// 频谱曲线图表设置
let amplitudeChartOpts = ref({
	dataLabel: false,
	update: true,
	duration: 0,
	dataPointShape: false,
	padding: [20, 30, 0, 5],
	xAxis: { boundaryGap: 'justify', labelCount: 6 },
	yAxis: { gridType: 'solid', data: [{ min: 0, max: 0.5 }] },
	extra: { markLine: { data: [
		{ value: ampDataThreshold, lineColor: '#DE4A42', showLabel: true, labelOffsetX: -10 }, // 阈值标记线
	] } }
});

// 方法：获取频谱曲线 X、Y、Z 轴数据
import { GetAmplitudeXData, GetAmplitudeYData, GetAmplitudeZData } from '@/request/api.js';
const getAmplitudeData = async () => {
	let timeStamp = transformTimeStamp(0, 'time_series');
	
	// X 轴数据
	GetAmplitudeXData(timeStamp, selectedDeviceId.value)
		.then((res) => {
			// console.log('GetAmplitudeXData response: ', res);
			let xresponse = res.data as any;
			amplitudeXData.value = JSON.parse(JSON.stringify(processAmpData(xresponse)));
			amplitudeDataRMS.value[0] = parseFloat(calculateAmplitudeRMS(xresponse.data).toFixed(3)); // 有效值保留 3 位小数
			amplitudeDataPV.value[0] = parseFloat(calculateAmplitudePV(xresponse.data).toFixed(3)); // 峰值保留 3 位小数
			checkAmpData(xresponse); // 检查异常值并警报
		})
		.catch((error) => {
			console.error('Error getting X amplitude Data: ', error);
		});
	
	/*-- axios 格式 --
	try {
		const response = await axios.get(xDataUrl);
		if (response.data.msg === 'success') {
			let xresponse = response.data.data as any;
			amplitudeXData.value = JSON.parse(JSON.stringify(processAmpData(xresponse)));
			amplitudeDataRMS.value[0] = parseFloat(xresponse.rms.toFixed(3)); // 有效值保留 3 位小数
			checkAmpData(xresponse); // 检查异常值并警报
		} else {
			console.log('Warning: getXAmplitudeData respond failed.');
		}
	} catch (error) {
		console.error('Error getting X amplitude Data: ', error);
	}
	---------------*/
	
	// Y 轴数据
	GetAmplitudeYData(timeStamp, selectedDeviceId.value)
		.then((res) => {
			// console.log('GetAmplitudeYData response: ', res);
			let yresponse = res.data as any;
			amplitudeYData.value = JSON.parse(JSON.stringify(processAmpData(yresponse)));
			amplitudeDataRMS.value[1] = parseFloat(calculateAmplitudeRMS(yresponse.data).toFixed(3)); // 有效值保留 3 位小数
			amplitudeDataPV.value[1] = parseFloat(calculateAmplitudePV(yresponse.data).toFixed(3)); // 峰值保留 3 位小数
			checkAmpData(yresponse); // 检查异常值并警报
		})
		.catch((error) => {
			console.error('Error getting Y amplitude Data: ', error);
		});
	
	/*-- axios 格式 --
	try {
		const response = await axios.get(yDataUrl);
		if (response.data.msg === 'success') {
			let yresponse = response.data.data as any;
			amplitudeYData.value = JSON.parse(JSON.stringify(processAmpData(yresponse)));
			amplitudeDataRMS.value[1] = parseFloat(yresponse.rms.toFixed(3)); // 有效值保留 3 位小数
			checkAmpData(yresponse); // 检查异常值并警报
		} else {
			console.log('Warning: getYAmplitudeData responds failed.');
		}
	} catch (error) {
		console.error('Error getting Y amplitude Data: ', error);
	}
	---------------*/
	
	// Z 轴数据
	GetAmplitudeZData(timeStamp, selectedDeviceId.value)
		.then((res) => {
			// console.log('GetAmplitudeZData response: ', res);
			let zresponse = res.data as any;
			amplitudeZData.value = JSON.parse(JSON.stringify(processAmpData(zresponse)));
			amplitudeDataRMS.value[2] = parseFloat(calculateAmplitudeRMS(zresponse.data).toFixed(3)); // 有效值保留 3 位小数
			amplitudeDataPV.value[2] = parseFloat(calculateAmplitudePV(zresponse.data).toFixed(3)); // 峰值保留 3 位小数
			checkAmpData(zresponse); // 检查异常值并警报
		})
		.catch((error) => {
			console.error('Error getting Z amplitude Data: ', error);
		})
	
	/*-- axios 格式 --
	try {
		const response = await axios.get(zDataUrl);
		if (response.data.msg === 'success') {
			let zresponse = response.data.data as any;
			amplitudeZData.value = JSON.parse(JSON.stringify(processAmpData(zresponse)));
			amplitudeDataRMS.value[2] = parseFloat(zresponse.rms.toFixed(3)); // 有效值保留 3 位小数
			checkAmpData(zresponse); // 检查异常值并警报
		} else {
			console.log('Warning: getZAmplitudeData responds failed.');
		}
	} catch (error) {
		console.error('Error getting Z amplitude Data: ', error);
	}
	---------------*/
	
	// 根据选择的方向配置数据
	if (curAxisIndex.value === 0) {
		amplitudeChartData.value = amplitudeXData.value;
	} else if (curAxisIndex.value === 1) {
		amplitudeChartData.value = amplitudeYData.value;
	} else if (curAxisIndex.value === 2) {
		amplitudeChartData.value = amplitudeZData.value;
	}
}

// 方法：处理频谱数据以适配图表，返回处理后数据
const processAmpData = (originalData: any) => {
	let intervals: number[] = originalData.frequencyInterval;
	let roundedIntervals = intervals.map(num => parseFloat(num.toFixed(3)));
	
	let resData = {
		categories: roundedIntervals,
		series: [ { name: originalData.direction + '轴', data: originalData.data } ]
	};
	
	return resData;
}

// 方法：计算频谱数据峰值
const calculateAmplitudePV = (data: number[]) => {
	return (data.length > 0 ? Math.max(...data) : undefined);
}

// 方法：计算频谱数据有效值
// 公式：√((∑y^2)-y0^2/2-yn^2/2)
const calculateAmplitudeRMS = (data: number[]) => {
	let sqSum = 0;
	data.forEach((d: number) => {
		sqSum += d * d;
	});
	return (
		data.length > 0 ? 
		Math.sqrt(sqSum-data[0]*data[0]/2-data[data.length-1]*data[data.length-1]/2) 
		: undefined
	);
}

/*------------------------------------------------------- 方向切换 -------------------------------------------------------*/

/*-- 控制台		--
	-- 轴选择 --*/
let curAxisIndex = ref<number>(0); // 0-x，1-y，2-z
const axisOrder = ['X轴', 'Y轴', 'Z轴'];
let axisSelectList = ref<AxisSelect[]>([
	{ name: 'X轴', disabled: false },
	{ name: 'Y轴', disabled: false },
	{ name: 'Z轴', disabled: false }
]);
let axisSelectValue = ref<string>('X轴'); // 默认选择X轴

// 选中单选框时触发
const axisRadioChange = (e: string) => {
	changeAxis(e);
}

// 方法：切换不同方向图表
const changeAxis = (axis: string) => {
	if (axis === 'X轴') {
		curAxisIndex.value = 0;
		timeChartData.value = timeXData.value;
		amplitudeChartData.value = amplitudeXData.value;
	} else if (axis === 'Y轴') {
		curAxisIndex.value = 1;
		timeChartData.value = timeYData.value;
		amplitudeChartData.value = amplitudeYData.value;
	} else if (axis === 'Z轴') {
		curAxisIndex.value = 2;
	  timeChartData.value = timeZData.value;
	  amplitudeChartData.value = amplitudeZData.value;
	}
	
	isLoading.value = true;
	setTimeout(() => {
		isLoading.value = false;
	}, 1000); // 加载 1s
}

/*------------------------------------------------------- 数据阈值与警报 -------------------------------------------------------*/

/*-- 数据阈值与警报 --
	--	存储异常数据		--*/
// 方法：获取设置的异常数据阈值
// ### todo 需要从之前页面获取
const getDataThreshold = () => {
	//
	//
	//
	timeDataThreshold.value = 0.2;
	timeChartOpts.value.extra.markLine.data[1].value = 	timeDataThreshold.value;
	timeChartOpts.value.extra.markLine.data[2].value = 	-timeDataThreshold.value;
	ampDataThreshold.value = 0.4;
	amplitudeChartOpts.value.extra.markLine.data[0].value = ampDataThreshold.value;
}
	
// 方法：检查超出阈值的时程数据，计算倍率，进行存储和警报
// 调用：在每次获取数据时调用
const checkTimeData = (originalData: any) => {
	originalData.data.forEach((t_data: number, index: number) => {
		if (t_data > timeDataThreshold.value) {
			// 计算倍率
			let ratio: number = t_data / timeDataThreshold.value;
			
			// 存储异常值
			let exceptionTimeData: ExceptionTimeData = {
				time: originalData.sdata + index * 8,
				direction: originalData.direction,
				device: originalData.device,
				data: t_data,
				urgency: ratio
			}
			saveExceptionTimeData(exceptionTimeData);
		}
	});
}

// 方法：通过 post 存储异常时程数据
// 类型：异步函数
import { PostTimeDataAnomaly } from '@/request/api.js';
const saveExceptionTimeData = async (exceptionData: ExceptionTimeData) => {
	PostTimeDataAnomaly(exceptionData)
		.then((res) => {
			console.log('PostTimeAnomaly response: ', res);
			console.log('Successfully uploaded time exceptional data.');
		})
		.catch((error) => {
			console.error('Error post time excetional data: ', error);
		})
	
	/*-- axios 格式 --
	try {
		const response = await axios.post(url, exceptionData);
		if (response.data.msg === 'success') {
			console.log('Successfully uploaded time exceptional data.');
		}
	} catch (error) {
		console.error('Error post time excetional data: ', error);
	}
	---------------*/
}

// 方法：检查超出阈值的频谱数据，计算倍率，进行存储和警报
// 调用：在每次获取数据时调用
const checkAmpData = (originalData: any) => {
	originalData.data.forEach((a_data: number, index: number) => {
		if (a_data > ampDataThreshold.value) {
			// 计算倍率
			let ratio: number = a_data / ampDataThreshold.value;
			
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
		}
	});
}

// 方法：通过 post 存储异常频谱数据
// 类型：异步函数
import { PostAmplitudeDataAnomaly } from '@/request/api.js';
const saveExceptionAmpData = async (exceptionData: ExceptionAmpData) => {
	PostAmplitudeDataAnomaly(exceptionData)
		.then((res) => {
			console.log('PostAmplitudeAnomaly response: ', res);
			console.log('Successfully uploaded amplitude exceptional data.');
		})
		.catch((error) => {
			console.error('Error post amplitude excetional data: ', error);
		})
	
	/*-- axios 格式 --
	try {
		const response = await axios.post(url, exceptionData);
		if (response.data.msg === 'success') {
			console.log('Successfully uploaded amplitude exceptional data.');
		}
	} catch (error) {
		console.error('Error post amplitude excetional data: ', error);
	}
	---------------*/
}

/*------------------------------------------------------- 定时器 -------------------------------------------------------*/

/*-- 定时器 --*/
let timeDataIntervalId: NodeJS.Timeout;
let ampDataIntervalId: NodeJS.Timeout;
let lastDegDataItvlId: NodeJS.Timeout;
let timeDataInterval: number = 1000;
let ampDataInterval: number = 1000;
let lastDegDataItv: number = 1000;

/*-- 入口函数 --*/
onShow(() => {
	getAllDevices(); // 获取所有设备信息
	getBuildingName(); // 获取当前建筑信息
	getDataThreshold(); // 获取数据阈值
	getSelectedDeviceId(); // 获取选择的设备信息
	getDeviceThisBuilding(); // 获取当前建筑所有设备信息，并立即配置设备选择列表
	getSelectedAxis(); // 获取选择的方向
	
	// getTimeData(); // 单次测试
	// getAmplitudeData(); // 单次测试
	lastDegDataItvlId = setInterval(getLastTimeData, lastDegDataItv); // 获取历史数据（每秒）
	timeDataIntervalId = setInterval(getTimeData, timeDataInterval); // 获取时程曲线数据（每秒）
	ampDataIntervalId = setInterval(getAmplitudeData, ampDataInterval); // 获取频谱曲线数据（每秒）
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

.controlbar {
	text-align: center;
	margin-bottom: 10px;
}

.dashboard-cards {
	display: block;
	justify-content: space-between;
	gap: 20px;
	margin-bottom: 20px;
}

.chart-info {
	 display: flex;
	 justify-content: center;
	 align-items: center;
	 margin-bottom: 1vh;
}

.card {
	height: 300px;
	border: 1px solid #E0E0E0;
	border-radius: 8px;
	margin-bottom: 30px;
}

.last-degree-buttons {
	display: flex;
	justify-content: center;
	gap: 200px;
	margin-top: 10px;
}

.axis-button {
  padding: 8px 15px;
  font-size: 14px;
}

.last-degree-button {
	padding: 8px 15px;
	font-size: 14px;
}
</style>