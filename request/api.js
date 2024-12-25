import request from '@/request/index.js'

// GET 请求获取所有设备信息
export const GetAllDevices = () => {
	return request({
		url: '/sensor',
		method: 'get',
		data: {},
		header: {}
	})
}

// GET 请求获取当前建筑设备信息
export const GetDeviceThisBuilding = (buildingName) => {
	return request({
		url: `/sensor/${buildingName}`,
		method: 'get',
		data: {},
		header: {}
	})
}

// GET 请求获取时程曲线 X 轴数据
export const GetTimeXData = (ftime, device) => {
	return request({
		url: `/timeSeries/X/${ftime}/${device}`,
		method: 'get',
		data: {},
		header: {}
	})
}

// GET 请求获取时程曲线 Y 轴数据
export const GetTimeYData = (ftime, device) => {
	return request({
		url: `/timeSeries/Y/${ftime}/${device}`,
		method: 'get',
		data: {},
		header: {}
	})
}

// GET 请求获取时程曲线 Z 轴数据
export const GetTimeZData = (ftime, device) => {
	return request({
		url: `/timeSeries/Z/${ftime}/${device}`,
		method: 'get',
		data: {},
		header: {}
	})
}

// GET 请求获取频谱曲线 X 轴数据
export const GetAmplitudeXData = (ftime, device) => {
	return request({
		url: `/frequency/X/${ftime}/${device}`,
		method: 'get',
		data: {},
		header: {}
	})
}

// GET 请求获取频谱曲线 Y 轴数据
export const GetAmplitudeYData = (ftime, device) => {
	return request({
		url: `/frequency/Y/${ftime}/${device}`,
		method: 'get',
		data: {},
		header: {}
	})
}

// GET 请求获取频谱曲线 Z 轴数据
export const GetAmplitudeZData = (ftime, device) => {
	return request({
		url: `/frequency/Z/${ftime}/${device}`,
		method: 'get',
		data: {},
		header: {}
	})
}

// POST 请求存储异常时程数据
export const PostTimeDataAnomaly = (anomaly) => {
	return request({
		url: '/TimeAnomaly',
		method: 'post',
		data: anomaly,
		header: {}
	})
}

// POST 请求存储异常频谱数据
export const PostAmplitudeDataAnomaly = (anomaly) => {
	return request({
		url: '/SpectrumAnomaly',
		method: 'post',
		data: anomaly,
		header: {}
	})
}
