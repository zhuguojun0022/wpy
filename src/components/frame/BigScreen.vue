
<template>
 <div class="body">
    <div class="top">
        <ul>
          <li class="top_time">{{date}} {{time}}</li>
            <li class="top_title" >电子社保卡签发情况</li>
            <li><span class="sign_out">退出登录</span></li>
        </ul>
    </div>
    <div class="data_show">
        <div class="flag" :style="{height:'60px', lineHeight:'60px'}">全国</div>
        <div class="div_data">
            <ul>
                <li><span>电子社保卡签发数量</span><label>{{cardAll}}</label></li>
                <li><span>一级签发数量</span><label>{{cardFirst}}</label></li>
                <li><span>二级签发数量</span><label>{{cardSecond}}</label></li>
                <li><span>开通城市数</span><label>{{cardCity}}</label></li>
                <li><span>接入渠道数</span><label>{{cardchannel}}</label></li>
            </ul>
        </div>
    </div>
    <div class="content">
       <div class="schart">
            <div>
                <div class="subtitle">电子社保卡签发统计</div>
                <div id="openZhe" :style="{width: '100%',height: '250%'}" ></div>
            </div>
            <div>
                <div class="subtitle">今日流量统计</div>
                <div id="openLiu" :style="{width: '100%',height: '250%'}">
                  <Bigliu></Bigliu>
                </div>
            </div>
        </div>
        <div class="map">
          <hostMap></hostMap>
    
        </div>
        <div class="schart">
            <div>
                <div class="subtitle">电子社保卡开通张数TOP5</div>
                <div id="openNum" :style="{width: '100%',height: '250%'}"></div>
            </div>
            <div>
                <div class="subtitle">各渠道开通电子社保卡情况</div>
                <div id="openChannel" :style="{width: '100%',height: '250%'}"></div>
            </div>
        </div>
    </div>
</div>
</template>
 
<script>
import echarts from "echarts";
import $ from "jquery";
import { setOptionBar } from "../option";
import { setOptionPie } from "../option";
import hostMap from "./hostMap";
import Bigliu from "./Bigliu";
import { infraApi } from "../../apis";

export default {
  data() {
    return {
      time: "",
      date: "",
      xzhedata: ["9月","10月","11月","12月"],
      yzheFdata: ["0"],
      yzheSdata: ["0"],
      tiaoData:[],
      zhuData:[],
      allSign:'',
      cardAll:80,
      cardFirst:70,
      cardSecond:10,
      cardCity:0,
      cardchannel:0,

    };
  },
  components: { hostMap, Bigliu },
  // components: {Count},
  mounted() {
    // this.txH();

    var that = this;
    var week = [
      "星期天",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六"
    ];
    var timerID = setInterval(updateTime, 1000);
    updateTime();
    function updateTime() {
      var cd = new Date();
      that.time =
        zeroPadding(cd.getHours(), 2) + ":" + zeroPadding(cd.getMinutes(), 2);
      that.date =
        zeroPadding(cd.getFullYear(), 4) +
        " 年 " +
        zeroPadding(cd.getMonth() + 1, 2) +
        " 月 " +
        zeroPadding(cd.getDate(), 2) +
        " 日 " +
        week[cd.getDay()];
    }

    function zeroPadding(num, digit) {
      var zero = "";
      for (var i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    }

    //折线图接口数据
    infraApi.dapingMoth().then(this.handleMothSuees.bind(this));
    infraApi.dapingCity().then(this.handleCitySuees.bind(this));
    infraApi.dapingChannel().then(this.handleChannelSuees.bind(this));
    let __this = this;
    this.allSign = setInterval(function(){ infraApi.dapingAll().then(__this.handleAllSuees.bind(__this));},1000)
   
    // this.drawLine(this.xzhedata,this.yzheFdata,this.yzheSdata);
    // this.getTime();
  },
  methods: {
    handleMothSuees(res) {
      // console.log(res.data.result[0].regionName)
     
      var cityData = res.data.result;
      var i = 0;
      if (cityData) {
        for (i in cityData) {
          let temp = cityData[i].month;
          this.xzhedata.unshift(temp.charAt(temp.length - 1) + "月");
          this.yzheFdata.push(cityData[i].ecardOneCount);
          this.yzheSdata.push(cityData[i].ecardTwoCount);
        }
      }
      this.drawLine(this.xzhedata, this.yzheFdata, this.yzheSdata,this.tiaoData,this.zhuData,this.sanData)
    },
    handleAllSuees(res) {
      //  console.log(res.data.result,"asd")
      // {cityCount: "35", channelCount: "20", ecardCount: "189", ecardOneCount: "126", ecardTwoCount: "63"} "asd"
      this.cardCity = res.data.result.cityCount;
      this.cardchannel = res.data.result.channelCount;
      // this. ecardCount = Number(res.data.result.cityCount) + Number(res.data.result.channelCount);
      this. cardAll = this.cardFirst + this.cardSecond;
      // var newData = Number(res.data.result.ecardOneCount);
      let oldoneData = this.cardFirst;
      let newoneData = res.data.result.ecardOneCount;
      this.playBack(newoneData,oldoneData);

      let oldtwoData = this.cardSecond;
      let newtwoData = res.data.result.ecardTwoCount;
      this.playBacktwo(newtwoData,oldtwoData);
      this.allSign = Number(res.data.result.ecardOneCount);
    },
    handleCitySuees(res){
       this.zhuData = res.data.result;
       this.drawLine(this.xzhedata, this.yzheFdata, this.yzheSdata,this.tiaoData,this.zhuData,this.sanData)
    },
    handleChannelSuees(res){
      this.sanData = res.data.result;
      this.drawLine(this.xzhedata, this.yzheFdata, this.yzheSdata,this.tiaoData,this.zhuData,this.sanData)
    },
    getTime() {
      this.topTime = new Data();
      // console(this.topTime, "asd");
    },
    txH() {
      var totalHeight = window.innerHeight;
      var totalWidth = window.innerWidth;
      $(function() {
        // $(".body").height(totalHeight);
        // $(".top_title").css("line-height", totalHeight * 0.07 * 0.7 + "px");
        // $(".top_title").css("height", totalHeight * 0.07 * 0.7 + "px");
        // $(".flag").css("line-height", totalHeight * 0.1 + "px");
        $("#openNum").height(totalHeight * 0.7 * 0.5 * 0.9 + "px");
        // $("#openChannel").height(totalHeight * 0.7 * 0.5 * 0.9 + "px");
        // $("#openLiu").height(totalHeight * 0.7 * 0.5 * 0.9 + "px");
        // $("#openZhe").height(totalHeight * 0.7 * 0.5 * 0.9 + "px");
      });
    },
     playBack(newData,oldData) {
      let that = this;
      var addNum = newData - oldData;
      var dataNum = addNum / 100;
       console.log(dataNum,"qqrt")
        let t = setInterval(function() {
         if(that.cardFirst < newData){
        var a = 0;
        that.cardFirst = that.cardFirst + dataNum;
        a = that.cardFirst + dataNum;
        that.cardFirst = Math.floor(a);}
        else{
            clearInterval(t)
         }
      }, 1000);
    },
     playBacktwo(newData,oldData) {
      let that = this;
      var addNum = newData - oldData;
      var dataNum = addNum / 100;
        let t = setInterval(function() {
         if(that.cardSecond < newData){
        var a = 0;
        that.cardSecond = that.cardSecond + dataNum;
        a = that.cardSecond + dataNum;
        that.cardSecond = Math.floor(a);}
        else{
            clearInterval(t)
         }
      }, 1000);
    },
    drawLine(xzhedata, yzheFdata, yzheSdata,tiaoData,zhuData,sanData) {
      // 折线统计图
      var myChartZhe = echarts.init(document.getElementById("openZhe"));
      var optionZhe = {
        tooltip: {
          trigger: "axis",
          borderType: "slider",
          borderWidth: "2",
          borderColor: "#12ADC7"
        },
        grid: {
          x: "15%",
          y: "25%",
          width: "80%",
          height: "60%"
        },
        legend: {
          data: ["一级签发", "二级签发"],
          textStyle: {
            fontSize: 12,
            color: "#FFF"
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisTick:{
            show:false //不显示刻度
          },
          axisLine: {
            lineStyle: {
              color: "#FFF"
            }
          },
           axisLabel:{interval:0}, //显示所有x轴坐标
          splitLine: {
            show: false
          },
          data: xzhedata
        },
        yAxis: {
          type: "value",
          name: "(万张)",
          axisLabel: {
            formatter: "{value} "
          },
          axisLine: {
            lineStyle: {
              color: "#FFF"
            }
          },

          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: "一级签发",
             smooth: true,
            type: "line",
            color: "#9B1CCF",
            symbol: "none",
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#9B1CCF"
                }
              }
            },
            data: yzheFdata
          },
          {
            name: "二级签发",
             smooth: true,
            color: "#156BD7",
            symbol: "none",
            type: "line",
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#156BD7"
                }
              }
            },
            data: yzheSdata
          }
        ]
      };
      myChartZhe.setOption(optionZhe);


      //条型图
      var myChart1 = echarts.init(document.getElementById("openNum"));
      var data3 = zhuData;
      var option1 = setOptionBar(data3);
      if (option1 && typeof option1 === "object") {
        myChart1.setOption(option1, true);
      }
      var myChart2 = echarts.init(document.getElementById("openChannel"));
      var data4 = sanData;
      var option2 = setOptionPie(data4);
      if (option2 && typeof option2 === "object") {
        myChart2.setOption(option2, true);
      }
    }
  },
  watch:{
    // allSign: this.playBack()
  },
  beforeDestroy() {
    clearInterval(this.allSign);        
    this.allSign = null;
}
};
</script>
 
 
<style >
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "微软雅黑";
}
.body {
  width: 100%;
  background: url("../assets/img/image/bg-body.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 2.8%;
  min-width: 1300px;
}
.top {
  height: 50px;
  /* height: 7%; */
  width: 100%;
  background: url("../assets/img/image/bg-top.png") no-repeat center;
  background-size: 60% 100%;
}
.top > ul {
  overflow: hidden;
}
.top li {
  list-style: none;
  float: left;
}
.top > ul > li:first-child,
.top > ul > li:last-child {
  width: 20%;
  color: #00deff;
  padding-left: 40px;
}
.top > ul > li:first-child {
  font-size: 14px;
}
.top > ul > li:nth-child(2) {
  width: 60%;
  text-align: center;
  font-size: 20px;
  color: #ffffff;
  height: 50px; /* wpy  */
  line-height: 30px;
}
.sign_out {
  float: right;
  margin-right: 40px;
  font-size: 16px;
  display: block;
  background: url("../assets/img/icon/icon-sign-out.png") no-repeat left center;
  background-size: 26px 26px;
  padding-left: 36px;
}
.data_show {
  width: 100%;
  height: 10%;
  margin-top: 2%;
  padding: 0px 40px;
  overflow: hidden;
}
.data_show > div {
  float: left;
  height: 100%;
}
.data_show > div:first-child {
  width: 15%;
  background: url("../assets/img/image/bg-flag.png") no-repeat;
  background-size: 100% 100%;
  font-size: 26px;
  color: #ffffff;
  text-align: center;
  font-family: "PingFangSC-Regular";
  line-height: 100%;
}
.data_show > div:last-child {
  width: 84.6%;
  height: 60px;
  margin-left: 0.4%;
  line-height: 150%;
  background: rgba(255, 255, 255, 0.05);
}
.div_data > ul {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.div_data li {
  list-style: none;
  float: left;
  height: 100%;
  width: 17%;
  margin-left: 3%;
  padding-top: 10px;
}
.div_data > ul > li:nth-child(1) {
  background: url("../assets/img/icon/icon-scard.png") no-repeat left top 10px;
  background-size: 22px 18px;
}
.div_data > ul > li:nth-child(2) {
  background: url("../assets/img/icon/icon-level1.png") no-repeat left top 10px;
  background-size: 18px 18px;
}
.div_data > ul > li:nth-child(3) {
  background: url("../assets/img/icon/icon-level2.png") no-repeat left top 10px;
  background-size: 18px 18px;
}
.div_data > ul > li:nth-child(4) {
  background: url("../assets/img/icon/icon-city.png") no-repeat left top 10px;
  background-size: 22px 18px;
}
.div_data > ul > li:nth-child(5) {
  background: url("../assets/img/icon/icon-channel.png") no-repeat left top 10px;
  background-size: 18px 18px;
}
.div_data span {
  font-size: 16px;
  color: #ffffff;
  margin-left: 30px;
}
.div_data label {
  font-size: 20px;
  color: #00deff;
  margin-left: 30px;
  display: block;
}
.content {
  height: 70%;
  width: 100%;
  padding: 0 40px;
  overflow: hidden;
}
.content > div {
  float: left;
  height: 100%;
}
.content > div:first-child {
  width: 20%;
}
.schart {
  width: 20%;
}
.map {
  width: 60%;
}
.schart > div {
  height: 47%;
}
.subtitle {
  width: 100%;
  background: url("../assets/img/image/bg-title.png") no-repeat right bottom;
  background-size: 100%;
  margin-top: 3%;
  font-size: 14px;
  color: #ffffff;
  line-height: 35px;
  padding-left: 10px;
}
.subtitle > div {
  background: rgba(255, 255, 255, 0.05);
}

.pop_title {
  border-bottom: 1px solid #12adc7;
  text-align: center;
  font-size: 18px;
  color: #fffffe;
  padding: 3px 0 5px 0;
}
.pop_ul > li {
  list-style: none;
  float: left;
  margin: 10px 0 0 0;
  width: 80px;
  text-align: center;
}
.pop_font1 {
  font-size: 16px;
  color: #fffffe;
}
.pop_font2 {
  font-size: 16px;
  color: #12adc7;
}
.pop_font2 > li {
  margin-bottom: 14px;
}
</style>
