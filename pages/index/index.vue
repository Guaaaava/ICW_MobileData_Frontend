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

/* -------------------------------------------------------------------------------------------------
// 辅助函数，用于补齐零
const padZero = (num: number) => num.toString().padStart(2, '0');

// 计算x轴的函数
const caculateTimeList = (start: number, interval: number): string[] => {
    const time_list: string[] = [];
    let i = 0;
    for(;i < 1000; i++){
        const date = new Date(start + i * interval);
        const year = date.getUTCFullYear(); // 获取年份
        const month = date.getUTCMonth() + 1; // 获取月份（注意月份从 0 开始，需要加 1）
        const day = date.getUTCDate(); // 获取日期
        const hour = date.getUTCHours() + 8; // 获取小时（加 8 是为了转换为北京时间）
        const minute = date.getUTCMinutes(); // 获取分钟
        const second = date.getUTCSeconds(); // 获取秒钟

        // const beijingTimeString = `${year}-${padZero(month)}-${padZero(day)}${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
        const beijingTimeString = `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
        time_list.push(beijingTimeString);
    }
    return time_list;
}

//绘制时程曲线
const drawTimeChart = (chartData: any) => {
  const deviceInfo = deviceList.value.find((d) => d.deviceId === chartData.device);
  if (deviceInfo) {
    chartData.deviceName = deviceInfo.deviceName;
  }
  var option: EChartsOption;

  //计算x轴
  const x_axis = caculateTimeList(chartData.s_date, 16);

  interface YData {
    [key: string]: number[]; // 添加索引签名，允许任意字符串类型的属性访问
  }

  const yData: YData = {
    x: chartData.x,
    y: chartData.y,
    z: chartData.z
  };

  let series: any[] = [];
  for (let name in yData) {
    var yline: any;
    var line_label: any;
    var label_position: any;
    if (name == 'x') {
      yline = chartData.rmsx;
      line_label = `X均值：${chartData.rmsx}`;
      label_position = 'insideStartTop';
    } else if (name == 'y') {
      yline = chartData.rmsy;
      line_label = `Y均值：${chartData.rmsy}`;
      label_position = 'insideMiddleTop';

    } else if (name == 'z') {
      yline = chartData.rmsz;
      line_label = `Z均值：${chartData.rmsz}`;
      label_position = 'insideEndTop';

    }
    series.push({
      name: name,
      type: 'line',
      data: yData[name],
      smooth: false,
      symbol: 'none', // 设置数据点的样式为 'none'
      markLine: {
        data: [
          {name: 'Average', yAxis: yline},
        ],
        itemStyle: {
          normal: {
            lineStyle: {
              color: '#ff0000',
            }
          }
        },
        label: {
          position: label_position,
          formatter: line_label,
          color: '#ff0000',
        }
      }
    })
  }
  option = {
    title: {
      text: `时程曲线：${chartData.deviceName}（设备${chartData.device}）`,
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {   //选择
      data: ['x', 'y', 'z']
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      show: true, // 是否显示工具栏
      feature: {
        saveAsImage: {}  //保存图片
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: x_axis
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} gal'
      }
    },
    series: series
  };

  option && timeChart.setOption(option);
}

//绘制幅频曲线
const drawAmplitudeChart = (data: any) => {
  const deviceInfo = deviceList.value.find((d) => d.deviceId === data.device);
  if (deviceInfo) {
    data.deviceName = deviceInfo.deviceName;
  }
  var option2: EChartsOption;

  //计算x轴
  interface YData {
    [key: string]: number[]; // 添加索引签名，允许任意字符串类型的属性访问
  }

  const yData: YData = {
    x: data.x,
    y: data.y,
    z: data.z
  };


  let series: any[] = [];
  for (let name in yData) {
    if (Object.prototype.hasOwnProperty.call(yData, name)) {
      series.push({
        name: name,
        type: 'line',
        data: yData[name],
        smooth: false,
        symbol: 'none', // 设置数据点的样式为 'none'
      });
    }
  }

  option2 = {
    title: {
      text: `频幅曲线：${data.deviceName}（设备${data.device}）`,
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {   //选择
      data: ['x', 'y', 'z']
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      show: true, // 是否显示工具栏
      feature: {
        saveAsImage: {}  //保存图片
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.interval
    },
    yAxis: {
      type: 'value',
    },
    series: series
  };
  option2 && amplitudeChart.setOption(option2);
}

//WebSocket
const websocketUrl = 'wss://digetech.cn:8771/websocket/user_58';
let socket1 = new WebSocket(websocketUrl);

//socket请求参数1：获取设备实时状态
const request1 = {
  code: 2,
  data: [
    'A77C5238', 'F853ED49', '9A0D1958', '87C3D4E4', '29FA1867', 'E43AC643'
  ],
  key: 'qiushangzhou852'
};
//socket请求参数2：获取设备详细数据
let request2 = {
  code: 1,
  data: selectedDevice.value.deviceId,
  channel: '0',
  pam: 1,
  key: 'qiushangzhou852'
};


//socket连接成功
socket1.onopen = () => {
  console.log('WebSocket connection1 opened');
  // WebSocket连接成功后发送请求1——获取设备实时状态
  socket1.send(JSON.stringify(request1));
  socket1.send(JSON.stringify(request2));
};

//接收到socket消息
socket1.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.code = 20001) {
    if (message.message == '基础数据') {
      // console.log(message.data);
      timeCurveData = message.data[0];
      AmplitudeCurveData = message.data[1];
      drawTimeChart(message.data[0]);
      drawAmplitudeChart(message.data[1]);
    } else if (message.message == '设备状态') {
      // console.log(message.data);
      devices.value = Object.entries(message.data).map(([key, value]) => ({
        deviceId: key,
        disabled: value === 1 ? false : true,
        online: value === 1 ? true : false
      }))
      devices.value.forEach((device: { deviceId: string; deviceName: string; }) => {
        // 假设 deviceList 已经填充了设备名
        const deviceInfo = deviceList.value.find((d) => d.deviceId === device.deviceId);
        if (deviceInfo) {
          device.deviceName = deviceInfo.deviceName;
        }
      });

    }

  }
};

//socket错误
socket1.onerror = (error) => {
  console.error('WebSocket error:', error);
};

//socket关闭
socket1.onclose = () => {
  console.log('WebSocket connection closed');
};


watch(selectedDevice, (newValue) => {
  request2.data = newValue.deviceId;
  socket1.close();
  socket1 = new WebSocket(websocketUrl);
  socket1.onopen = () => {
    console.log('WebSocket connection1 reopened');
    // WebSocket连接成功后发送请求1——获取设备实时状态
    socket1.send(JSON.stringify(request1));
    socket1.send(JSON.stringify(request2));
  };

  //接收到socket消息
  socket1.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.code = 20001) {
      if (message.message == '基础数据') {
        // console.log(message.data);
        timeCurveData = message.data[0];
        AmplitudeCurveData = message.data[1];
        drawTimeChart(message.data[0]);
        drawAmplitudeChart(message.data[1]);
      } else if (message.message == '设备状态') {
        // console.log(message.data);
        devices.value = Object.entries(message.data).map(([key, value]) => ({
          deviceId: key,
          disabled: value === 1 ? false : true,
          online: value === 1 ? true : false
        }))
        devices.value.forEach((device: { deviceId: string; deviceName: string; }) => {
          // 假设 deviceList 已经填充了设备名
          const deviceInfo = deviceList.value.find((d) => d.deviceId === device.deviceId);
          if (deviceInfo) {
            device.deviceName = deviceInfo.deviceName;
          }
        });
      }

    }
  };

  //socket错误
  socket1.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  //socket关闭
  socket1.onclose = () => {
    console.log('WebSocket connection closed');
  };
});
----------------------------------------------------------------------------------------------------- */
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