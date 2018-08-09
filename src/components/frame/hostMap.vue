
<template>
  <div id="myChart" :style="{width: '100%', height: '580px'}"></div>
</template>
 
<script>
import echarts from "echarts";
import $ from "jquery";
import { infraApi } from "../../apis";

import { systemApi } from "../../apis";
require("echarts/map/js/china.js"); // 引入中国地图组件
require("echarts/map/js/province/anhui.js"); // 引入中国地图组件
// 引入提示框和title组件
export default {
  data() {
    return {
      data: [],
      weiData: [],
      mapData: {}
    };
  },
  mounted() {
     infraApi.dapingAllCity().then(this.handleAllCitySuees.bind(this));
    
  },
  methods: {
    // jump(){this.$router.push('/')},
    handleAllCitySuees(res) {
      // console.log(res.data.result[0].regionName)
      var cityData = res.data.result;
      var i = 0;
      if (cityData) {
        for (i in cityData) {
         this.data.push({name:cityData[i].regionName.slice(0,2),value:Number(cityData[i].ecardCount),
         level1:Number(cityData[i].ecardOneCount),level2:Number(cityData[i].ecardTwoCount),
    });
         this.weiData.push([Number(cityData[i].longitude),Number(cityData[i].latitude)]);
          this.mapData[cityData[i].regionName.slice(0,2)] = this.weiData[i];
        }
          this.drawLine();
      }
    //   conl
    },
    drawLine() {
      let that = this;
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));

      // 绘制图表
      // var data = [
      //   { name: "辽宁", value: 49, level1: "32", level2: "17" },
      //   { name: "海南", value: 120, level1: "100", level2: "200" },
      //   { name: "福建", value: 160, level1: "100", level2: "200" },
      //   { name: "四川", value: 112, level1: "100", level2: "200" },
      //   { name: "山东", value: 114, level1: "100", level2: "200" }
      // ];
      // var geoCoordMap = {
      //   海南: [110.35, 20.02],
      //   辽宁: [123.38, 41.8],
      //   福建: [119.3, 26.08],
      //   四川: [104.06, 30.67],
      //   山东: [117, 36.65]
      // };
      var data = this.data;
      var geoCoordMap = this.mapData;
      var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      };

      var option = {
        tooltip: {
          show: "true",
          // componentType: 'series',
          trigger: "item",
          borderType: "slider",
          borderWidth: "2",
          borderColor: "#12ADC7",
          axisPointer: {
            type: "shadow"
          },
          formatter: function(params, ticket, callback) {
            var html =
              "<div class='wpypop_title'>" +
              params.data.name +
              "</div>" +
              "<ul class='wpypop_ul pop_font1'><li>签发数</li><li>一级签发</li><li>二级签发</li></ul>" +
              "<ul class='wpypop_ul pop_font2'><li>" +
              params.data.value +
              "</li><li>" +
              params.data.level1 +
              "</li><li>" +
              params.data.level2 +
              "</li></ul>";
            return html;
          }
        },

        visualMap: {
          min: 0,
          max: 1500,
          left: "left",
          top: "bottom",
          text: ["High", "Low"],
          seriesIndex: [2],
          show: false,
          inRange: {
            color: ["#0F1E55"]
          },
          calculable: true
        },
        geo: {
          map: "china",
          zoom: 1.2,
          roam: true,
          label: {
            emphasis: {
              borderWidth: 1,
              areaColor: "#02489C",
              borderColor: "#00DEFF",
              show: false
            }
          },

          itemStyle: {
            normal: {
              borderWidth: 1,
              areaColor: "#19287D",
              borderColor: "#156BD7"
            },
            emphasis: {
              borderWidth: 1,
              areaColor: "#02489C",
              borderColor: "#00DEFF"
            }
          }
        },
        grid: {
          containLabel: true,
          top: "10%",
          width: "80%",
          height: "100%"
        },
        series: [
          {
            name: "pm2.5",
            type: "scatter",
            visualMap: false,
            coordinateSystem: "geo",
            data: convertData(data),
            symbolSize: function(val) {
              return val[2] / 100;
            }
          },

          {
            name: "Top 5",
            tooltip: { show: false },
            type: "effectScatter",
            visualMap: false,
            coordinateSystem: "geo",
            data: convertData(
              data
                .sort(function(a, b) {
                  return b.value - a.value;
                })
                .slice(0)
            ),
            symbolSize: function(val) {
              return val[2] / 10 + 5;
            },
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke"
            },
            hoverAnimation: true,
            label: {
              normal: {
              formatter: "{b}",
                position: "right",
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: "#f4e925",
                shadowBlur: 110,
                shadowColor: "#333"
              }
            }
          },
          {
            name: "categoryA",
            type: "map",
            geoIndex: 0,
            data: data
            // data: [
            //   { name: "辽宁", value: 200, level1: "100", level2: "200" },
            //   { name: "海南", value: 120, level1: "100", level2: "200" },
            //   { name: "福建", value: 160, level1: "100", level2: "200" },
            //   { name: "四川", value: 112, level1: "100", level2: "200" },
            //   { name: "山东", value: 114, level1: "100", level2: "200" }
            // ]
          }
        ]
      };
      myChart.setOption(option);
      // myChart.on('click', function(params) {
      //  that.$router.push('/hi2');
      //  window.localStorage.setItem(provinceId,params.data.name)
      // })
    }
  }
};
</script>
 
 
<style scoped>
</style>

