import moment from "moment";
import * as echarts from "echarts";
import { EChartOption } from "echarts";

export const chartOptions: EChartOption = {
  animation: false,
  xAxis: {
    type: "time",
    interval: 5 * 60 * 1000,
    splitLine: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: "#696B6E",
      formatter: (value: number) => moment(value).format("HH:mm"),
    },
    data: [],
  },
  yAxis: {
    type: "value",
    name: "Mbps",
    nameTextStyle: {
      color: "#696B6E",
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: "#696B6E",
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "#EDEDEE",
        type: "dashed",
      },
    },
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      lineStyle: {
        color: "rgba(104, 133, 197, 0.53)",
      },
    },
    appendToBody: true,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    extraCssText:
      "box-shadow: 0 2px 8px 0 rgba(0,0,0,0.15);border-radius: 4px 4px 4px 0 0 0 4px;",
    formatter: "a,b",
  },
  grid: {
    top: "50px",
    left: "50px",
    right: "20px",
    bottom: "30px",
  },
  series: [{
    data: [],
    type: "line",
    // 点实心
    symbol: "circle",
    // 背景渐变
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "rgba(85,211,199,0.3)" },
        { offset: 1, color: "rgba(255, 255, 255, 1)" },
      ]),
    },
    itemStyle: {
      // 点的颜色
      color: "transparent",
    },
    lineStyle: {
      width: 2,
      type: "solid",
      color: "rgba(0,211,190,1)",
    },
  }],
};

export const timeRangeOptions = [
  {
    label: "last 1 hour",
    value: 1 * 3600 * 1000,
  },
  {
    label: "last 6 hour",
    value: 6 * 3600 * 10000,
  },
  {
    label: "last 12 hour",
    value: 12 * 3600 * 10000,
  },
];

export const timeGranularityOptions = [
  {
    label: "10s",
    value: 10 * 1000,
  },
  {
    label: "1 min",
    value: 60 * 1000,
  },
];
