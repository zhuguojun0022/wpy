<template>
  <div id="myChartliu" :style="{width: '100%', height: '250px'}"></div>
</template>
<script>
import echarts from "echarts";
import { formatDate } from "./formateDate.js";

export default {
  data() {
    return {
      xdata: [],
      ydata: [],
      stopTime: ""
    };
  },
  created() {},
  mounted() {
    this.stratsData();
    let _this = this;
    this.stopTime = setInterval(function() {
      _this.getData();
    }, 3000);
  },
  methods: {
    stratsData() {
      var now = new Date().valueOf();
      for (var i = 0; i < 60; i++) {
        var nowTime = new Date(now);
        var lastTime = formatDate(nowTime, "hh:mm:ss");
        this.xdata.unshift(lastTime);
        now -= 1000;
      }
      this.ydata = [];
      for (var i = 0; i < 60; i++) {
        var ass = 50;
        this.ydata.push(ass + Math.floor(Math.random() * 50));
      }
      this.drawLine(this.xdata, this.ydata);
    },
    getData() {
      var now = new Date().valueOf();
      var nowTime = new Date(now);
      var lastTime = formatDate(nowTime, "hh:mm:ss");
      this.xdata.shift();
      this.xdata.push(lastTime);
      var ass = 50;
      var lastY = Math.floor(ass + Math.random() * 50);
      this.ydata.shift();
      this.ydata.push(lastY);
      this.drawLine(this.xdata, this.ydata);
    },
    drawLine(xdata, ydata) {
      // 基于准备好的dom，初始化echarts实例
      let myChartliu = this.$echarts.init(
        document.getElementById("myChartliu")
      );
      var option1 = setOptionBar();
      function setOptionBar() {
        var option = {
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["数据量"],
            textStyle: {
              fontSize: 12,
              color: "#FFF"
            }
          },
          xAxis: {
            type: "category",
            // max:5,
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                fontSize: 5,
                color: "#FFF"
              }
            },

            scale: false,
            axisLabel: {
              interval: 15
              // textStyle: {
              //   fontSize:
              // }
            },
            splitLine: {
              show: false
            },
            data: xdata
          },
          yAxis: {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#FFF"
              }
            },
            splitLine: {
              show: false
            }
          },
          grid: {
            containLabel: true,
            x: "1%",
            y: "15%",
            width: "100%",
            height: "70%"
          },
          series: [
            {
              name: "数据量",
              type: "line",
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "#0022AA" },{ offset: 1, color: "#00FFFE" }]),
              symbol: "none",
              smooth: true,
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: "rgba(255,255,255,0)"
                  }
                }
              },
              areaStyle: {},
              data: ydata
            }
          ]
        };
        return option;
      }

      myChartliu.setOption(option1);
    }
  },
  beforeDestroy() {
    clearInterval(this.stopTime);
    this.stopTime = null;
  }
};
</script>
 
 
<style scoped>
</style>
