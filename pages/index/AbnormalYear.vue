<template>
  <div id="app" class="container">
    <h1>异常数据展示</h1>
    <div class="table-container">
      <!-- 时程曲线异常数据表 -->
      <div class="table-wrapper">
        <h2>时程曲线异常数据</h2>
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>方向</th>
              <th>设备</th>
              <th>紧急程度</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in timeCurveData" :key="index" :class="{'odd-row': index % 2 === 0}">
              <td>{{ item.time }}</td>
              <td>{{ item.direction }}</td>
              <td>{{ item.device }}</td>
              <td>{{ item.urgency }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 频谱曲线异常数据表 -->
      <div class="table-wrapper">
        <h2>频谱曲线异常数据</h2>
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>方向</th>
              <th>设备</th>
              <th>频率区间</th>
              <th>数据</th>
              <th>紧急程度</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in frequencySpectrumData" :key="index" :class="{'odd-row': index % 2 === 0}">
              <td>{{ item.time }}</td>
              <td>{{ item.direction }}</td>
              <td>{{ item.device }}</td>
              <td>{{ item.frequency_interval }}</td>
              <td>{{ item.data }}</td>
              <td>{{ item.urgency }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 假数据 - 时程曲线异常数据
      timeCurveData: [
        { time: "2024-12-09 10:00", direction: "X", device: "Device A", urgency: "高" },
        { time: "2024-12-09 11:00", direction: "Y", device: "Device B", urgency: "中" },
      ],
      // 假数据 - 频谱曲线异常数据
      frequencySpectrumData: [
        { time: "2024-12-09 10:00", direction: "Z", device: "Device C", frequency_interval: "20-30Hz", data: "0.85", urgency: "低" },
        { time: "2024-12-09 11:00", direction: "X", device: "Device D", frequency_interval: "15-25Hz", data: "1.2", urgency: "高" },
      ],
    };
  },
};
</script>

<style>
/* 页面整体布局 */
.container {
  font-family: 'Arial', sans-serif;
  margin: 20px;
  background-color: #f4f7fc;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 标题样式 */
h1 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

/* 表格容器 */
.table-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.table-wrapper {
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

/* 表格标题 */
h2 {
  text-align: center;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

/* 表格样式 */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

th,
td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

th {
  background-color: #f1f1f1;
  color: #666;
  font-weight: bold;
}

td {
  color: #555;
}

/* 交替行颜色 */
tr.odd-row {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .table-container {
    flex-direction: row;
    justify-content: space-between;
  }

  .table-wrapper {
    width: 48%;
  }
}
</style>
