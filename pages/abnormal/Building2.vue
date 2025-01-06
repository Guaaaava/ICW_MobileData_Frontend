<template>
  <div id="app" class="container">
    <!-- 曲线类型选择 -->
    <div class="type-selector">
      <button 
        :class="{'active': activeType === 'timeCurve'}" 
        @click="setActiveType('timeCurve')">
        时程曲线
      </button>
      <button 
        :class="{'active': activeType === 'frequencySpectrum'}" 
        @click="setActiveType('frequencySpectrum')">
        频谱曲线
      </button>
    </div>

    <!-- 异常数据表 -->
    <div v-if="activeType === 'timeCurve'" class="table-wrapper">
      <div class="table-container">
				<table>
				  <thead>
				    <tr>
				      <th>时间</th>
				      <th 
				        @click="toggleFilter('direction')" 
				        :class="{'active': filters.direction}">
				        方向▼
				      </th>
				      <th 
				        @click="toggleFilter('device')" 
				        :class="{'active': filters.device}">
				        设备▼
				      </th>
				      <th 
				        @click="toggleFilter('urgency')" 
				        :class="{'active': filters.urgency}">
				        紧急程度▼
				      </th>
				    </tr>
				  </thead>
				  <tbody>
				    <tr v-for="(item, index) in filteredTimeCurveData" :key="index" :class="{'odd-row': index % 2 === 0}">
				      <td>{{ formatTime(item.time) }}</td>
				      <td>{{ item.direction }}</td>
				      <td>{{ item.device }}</td>
				      <td>{{ formatUrgency(item.urgency) }}</td>
				    </tr>
				  </tbody>
				</table>
			</div>
    </div>

    <div v-if="activeType === 'frequencySpectrum'" class="table-wrapper">
      <div class="table-container">
				<table>
				  <thead>
				    <tr>
				      <th>时间</th>
				      <th 
				        @click="toggleFilter('direction')" 
				        :class="{'active': filters.direction}">
				        方向▼
				      </th>
				      <th 
				        @click="toggleFilter('device')" 
				        :class="{'active': filters.device}">
				        设备▼
				      </th>
				      <th @click="toggleFilter('frequency')">频率区间</th>
				      <th @click="toggleFilter('data')">数据</th>
				      <th 
				        @click="toggleFilter('urgency')" 
				        :class="{'active': filters.urgency}">
				        紧急程度▼
				      </th>
				    </tr>
				  </thead>
				  <tbody>
				    <tr v-for="(item, index) in filteredFrequencySpectrumData" :key="index" :class="{'odd-row': index % 2 === 0}">
				      <td>{{ formatTime(item.time) }}</td>
				      <td>{{ item.direction }}</td>
				      <td>{{ item.device }}</td>
				      <td>{{ item.frequencyInterval }}</td>
				      <td>{{ item.data }}</td>
				      <td>{{ formatUrgency(item.urgency) }}</td>
				    </tr>
				  </tbody>
				</table>
			</div>
    </div>

    <!-- 方向选择框 -->
    <div v-if="showDirectionFilter" class="filter-popup">
      <u-select 
        v-model="showDirectionFilter"
        :list="directionList"
        @confirm="confirmFilterDirection"
      ></u-select>
    </div>

    <!-- 设备选择框 -->
    <div v-if="showDeviceFilter" class="filter-popup">
      <u-select 
        v-model="showDeviceFilter"
        :list="deviceSelectList"
        @confirm="confirmFilterDevice"
      ></u-select>
    </div>

    <!-- 紧急程度选择框 -->
    <div v-if="showUrgencyFilter" class="filter-popup">
      <u-select 
        v-model="showUrgencyFilter"
        :list="urgencyList"
        @confirm="confirmFilterUrgency"
      ></u-select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeType: 'timeCurve',
      timeCurveData: [],
      frequencySpectrumData: [],
      filters: {
        startYear: null,
        startMonth: null,
        startDay: null,
        endYear: null,
        endMonth: null,
        endDay: null,
        direction: null,
        device: null,
        urgency: null,
      },
      years: Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i),
      months: Array.from({ length: 12 }, (_, i) => i + 1),
      days: Array.from({ length: 31 }, (_, i) => i + 1),
      directionList: [{ label: "全部", value: null },{ label: "X", value: "X" }, { label: "Y", value: "Y" }, { label: "Z", value: "Z" }],
      deviceSelectList: [
        { label: "全部", value: null },
        { label: "E43AC643", value: "E43AC643" },
        { label: "29FA1867", value: "29FA1867" },
        { label: "87C3D4E4", value: "87C3D4E4" },
        { label: "9A0D1958", value: "9A0D1958" },
				{ label: "F853ED49", value: "F853ED49" },
				{ label: "A77C5238", value: "A77C5238" },
      ],
      urgencyList: [
        { label: "全部", value: null },
        { label: "低", value: 1 },
        { label: "中", value: 2 },
        { label: "高", value: 3 },
        { label: "极高", value: 4 },
      ],
      showDirectionFilter: false,
      showDeviceFilter: false,
      showUrgencyFilter: false,
    };
  },
  computed: {
    filteredTimeCurveData() {
      return this.applyFilter(this.timeCurveData);
    },
    filteredFrequencySpectrumData() {
      return this.applyFilter(this.frequencySpectrumData);
    },
  },
  methods: {
    async fetchData() {
      try {
        const timeUrl = "http://110.42.214.164:8003/TimeAnomaly";
        const spectrumUrl = "http://110.42.214.164:8003/SpectrumAnomaly";
        
        const timeResponse = await uni.request({
        	url: timeUrl,
        	method: 'GET',
        	data: {},
        });
        
        const spectrumResponse = await uni.request({
        	url: spectrumUrl,
        	method: 'GET',
        	data: {},
        });
        
        const timeResult = timeResponse.data;
        const spectrumResult = spectrumResponse.data;
        
        if (timeResult.code === 200) {
          this.timeCurveData = timeResult.data;
        }
        if (spectrumResult.code === 200) {
          this.frequencySpectrumData = spectrumResult.data;
        }
      } catch (error) {
        console.error("获取数据失败：", error);
      }
    },
    applyFilter(data) {
      return data.filter(item => {
        const matchesDirection = !this.filters.direction || item.direction === this.filters.direction;
        const matchesDevice = !this.filters.device || item.device === this.filters.device;
        const matchesUrgency = !this.filters.urgency || item.urgency === this.filters.urgency;
        
        return matchesDirection && matchesDevice && matchesUrgency;
      });
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
    formatUrgency(level) {
      const levels = { 1: "低", 2: "中", 3: "高", 4: "极高" };
      return levels[level] ;
    },
    setActiveType(type) {
      this.activeType = type;
    },
    toggleFilter(column) {
      this.showDirectionFilter = false;
      this.showDeviceFilter = false;
      this.showUrgencyFilter = false;

      if (column === 'direction') {
        this.showDirectionFilter = true;
      } else if (column === 'device') {
        this.showDeviceFilter = true;
      } else if (column === 'urgency') {
        this.showUrgencyFilter = true;
      }
    },
    confirmFilterDirection(selected) {
      this.filters.direction = selected[0].value;
    },
    confirmFilterDevice(selected) {
      this.filters.device = selected[0].value;
    },
    confirmFilterUrgency(selected) {
      this.filters.urgency = selected[0].value;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style>
.container {
  font-family: 'Arial', sans-serif;
  margin: 20px;
  background-color: #f4f7fc;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.type-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.type-selector button {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  background-color: #f1f1f1;
  color: #555;
  font-size: 1rem;
  cursor: pointer;
  text-align: center;
}

.type-selector button.active {
  background-color: #4caf50;
  color: #fff;
  font-weight: bold;
}

.filters {
  margin-bottom: 20px;
}

.table-wrapper {
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.table-wrapper h2 {
  text-align: center;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.table-container {
	overflow-x: auto;
	white-space: nowrap;
	border: 1px solid #ddd;
	padding: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

th, td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
  font-size: 1rem;
}

th {
  background-color: #f1f1f1;
  color: #666;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

th:hover {
  background-color: #e0e0e0;
  color: #007bff;
}

th.active {
  color: #4caf50;
  font-weight: bold;
}

tr.odd-row {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}
</style>
