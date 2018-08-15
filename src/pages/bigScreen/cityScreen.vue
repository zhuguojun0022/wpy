<template>
<div class="wpybody">
    <div class="wpytop">
        <ul>
          <li class="top_time">{{date}} {{time}}</li>
            <li class="top_title" >电子社保卡签发情况</li>
            <li><span class="sign_out" @click="goback">返回</span></li>
        </ul>
    </div>
    <div class="data_show">
        <div class="flag" :style="{height:'60px', lineHeight:'60px'}">{{areaBig}}</div>
        <div>
          <cityTop></cityTop>
        </div>
    </div>
    <div class="wpycontent">
       <div class="schart">
            <div>
                <div class="subtitle">电子社保卡签发统计</div>
                <div id="openZhe" :style="{width: '100%',height: '100%'}" ></div>
            </div>
            <div>
                <div class="subtitle">今日流量统计</div>
                <div id="openLiu" :style="{width: '100%',height: '100%'}">
                  <Bigliu></Bigliu>
                </div>
            </div>
        </div>
        <div class="map">
          <cityMap></cityMap>
        </div>
        <div class="schart">
            <div>
                <div class="subtitle">各地区电子社保卡开通张数TOP5</div>
                <div id="openNum" :style="{width: '100%',height: '100%'}"></div>
            </div>
            <div>
                <div class="subtitle">各渠道开通电子社保卡情况</div>
                <div id="openChannel" :style="{width: '100%',height: '100%'}"></div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import echarts from 'echarts'
import { setOptionPie, setOptionBar } from './option'
import cityMap from './cityMap'
import Bigliu from './Bigliu'
import cityTop from './cityTop'
import { infraApi } from '../../apis'
import './BigScreen.css'
export default {
    data () {
        return {
            time: '',
            data: '',
            xzhedata: ['9月', '10月', '11月'],
            yzheFdata: [],
            yzheSdata: [],
            tiaoData: [],
            zhuData: [],
            sanData: [],
            allSign: '',
            timerID: ''
        }
    },
    components: {
        cityMap, Bigliu, cityTop
    },
    mounted () {
        let provinceBig = window.sessionStorage.getItem('cityId')
        let regionBig = window.sessionStorage.getItem('cityNumId')
        this.areaBig = provinceBig
        this.areaBlog = regionBig
        // console.log(this.areaBlog,"wpy1")
        // this.drawLine(provinceBig);
        let that = this
        let week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        this.timerId = setInterval(updateTime, 1000)
        updateTime()
        function updateTime () {
            let cd = new Date()
            that.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2)
            that.date = zeroPadding(cd.getFullYear(), 4) + ' 年 ' + zeroPadding(cd.getMonth() + 1, 2) + ' 月 ' + zeroPadding(cd.getDate(), 2) + ' 日 ' + week[cd.getDay()]
        }
        function zeroPadding (num, digit) {
            var zero = ''
            for (let i = 0; i < digit; i++) {
                zero += '0'
            }
            return (zero + num).slice(-digit)
        }
        infraApi.dapingMoth(this.areaBlog).then(this.handleMothSuees.bind(this))
        infraApi.dapingCity(this.areaBlog).then(this.handleCitySuees.bind(this))
        infraApi.dapingChannel(this.areaBlog).then(this.handleChannelSuees.bind(this))
    },
    methods: {
        handleMothSuees (res) {
            let cityData = res.data.result
            let i = 0
            if (cityData) {
                for (i in cityData) {
                    let temp = cityData[i].month
                    this.xzhedata.unshift(temp.charAt(temp.length - 1) + '月')
                    this.yzheFdata.push(cityData[i].ecardOneCount)
                    this.yzheSdata.push(cityData[i].ecardTwoCount)
                }
            }
            this.drawLine(this.xzhedata, this.yzheFdata, this.yzheSdata, this.tiaoData, this.zhuData, this.sanData)
        },
        handleCitySuees (res) {
            this.zhuData = res.data.result
            this.drawLine(this.xzhedata, this.yzheFdata, this.yzheSdata, this.tiaoData, this.zhuData, this.sanData)
        },
        handleChannelSuees (res) {
            this.sanData = res.data.result
            this.drawLine(this.xzhedata, this.yzheFdata, this.yzheSdata, this.tiaoData, this.zhuData, this.sanData)
        },
        goback () {
            this.$router.go(-1)
        },
        drawLine (xzhedata, yzheFdata, yzheSdata, tiaoData, zhuData, sanData) {
            let myChartZhe = echarts.init(document.getElementById('openZhe'))
            let optionZhe = {
                tooltip: {
                    trigger: 'axis',
                    borderType: 'slider',
                    borderWidth: '2',
                    borderColor: '#12ADC7'
                },
                grid: {
                    x: '12%',
                    y: '25%',
                    width: '80%',
                    height: '60%'
                },
                legend: {
                    data: ['一级签发', '二级签发'],
                    textStyle: {
                        fontSize: 12,
                        color: '#FFF'
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#FFF'
                        }
                    },
                    axisLabel: { interval: 0 },
                    splitLine: {
                        show: false
                    },
                    data: xzhedata
                },
                yAxis: {
                    type: 'value',
                    name: '单位：张',
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#FFF'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: [
                    {
                        name: '一级签发',
                        smooth: true,
                        type: 'line',
                        color: '#9B1CCF',
                        symbol: 'none',
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: '#9B1CCF'
                                }
                            }
                        },
                        data: yzheFdata
                    },
                    {
                        name: '二级签发',
                        smooth: true,
                        color: '#156BD7',
                        symbol: 'none',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: '#156BD7'
                                }
                            }
                        },
                        data: yzheSdata
                    }
                ]
            }
            myChartZhe.setOption(optionZhe)
            let myChart1 = echarts.init(document.getElementById('openNum'))
            let data3 = zhuData
            let option1 = setOptionBar(data3)
            if (option1 && typeof option1 === 'object') {
                myChart1.setOption(option1, true)
            }
            let myChart2 = echarts.init(document.getElementById('openChannel'))
            let data4 = sanData
            let option2 = setOptionPie(data4)
            if (option2 && typeof option2 === 'object') {
                myChart2.setOption(option2, true)
            }
        }
    },
    beforeDestroy () {
        clearInterval(this.allSign)
        clearInterval(this.timerID)
        this.allSign = null
    }
}
</script>

<style  >
.wpypop_title {
  border-bottom: 1px solid #12adc7;
  text-align: center;
  font-size: 15px;
  color: #fffffe;
  padding: 2px 0 2px 0;
}
.wpypop_ul > li {
  list-style: none;
  float: left;
  margin: 3px 0 0 0;
  width: 64px;
  text-align: center;
}
.wpypop_font1 {
  font-size: 12px;
  color: #fffffe;
}
.wpypop_font2 {
  font-size: 13px;
  color: #12adc7;
  font-weight: 520;
}
.wpypop_font2 > li {
  margin-bottom: 7px;
}
</style>
