import React, { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import { ECharts, EChartOption } from 'echarts'
import { Select, Button } from "antd";
import Throughput from "./throughput.helper";
import {
  chartOptions,
  timeGranularityOptions,
  timeRangeOptions
} from "./throughput.const";
import 'antd/dist/antd.css'
import "./throughput.css";

const Option = Select.Option;

const EChart: React.FC = () => {
  const chartRef = useRef(null);
  // 设置初始的时间范围为 1 hour
  const [timeRange, setTimeRange] = useState(15 * 60 * 1000);
  // 时间粒度为 10s
  const [timeGranularity, setTimeGranularity] = useState(1 * 1000);
  let chartInstance: ECharts;
  let throughput: Throughput;

  const initChart = (data:(number[])[]) => {
    const option = chartInstance.getOption();
    const series = option.series as EChartOption.SeriesLine[];
    series[0].data = data;
    const xAxis = option.xAxis as EChartOption.XAxis;
    // 横坐标轴只显示 12个 刻度，避免因为数据 所以计算每个刻度的步长
    xAxis.interval = Math.floor((data.length * timeGranularity) / 12);
    chartInstance.setOption(option);
  };

  useEffect(() => {
    if (chartRef && chartRef.current && !chartInstance) {
      chartInstance = echarts.init(chartRef.current as HTMLDivElement);
      chartInstance.setOption(chartOptions);
      throughput = new Throughput({
        duration: timeRange,
        granularity: timeGranularity,
        update: (data)=>{
          initChart(data)
        }
      })
    }
  }, []);

  return (
    <div>
      <div className="operation">
        <Button type="primary" onClick={()=>{
          throughput.init()
        }}>
          Refresh
        </Button>
      </div>
      <div ref={chartRef} className="chartContainer" />
    </div>
  );
};

export default EChart;
