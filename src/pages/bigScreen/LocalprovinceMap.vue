<template>
<div id="myChart" :style="{width: '100%', height: '100%'}"></div>
</template>
<script>
import { infraApi } from '../../apis'
require('echarts/map/js/china.js')
require('echarts/map/js/province/anhui.js')
require('echarts/map/js/province/aomen.js')
require('echarts/map/js/province/beijing.js')
require('echarts/map/js/province/chongqing.js')
require('echarts/map/js/province/fujian.js')
require('echarts/map/js/province/gansu.js')
require('echarts/map/js/province/guangdong.js')
require('echarts/map/js/province/guangxi.js')
require('echarts/map/js/province/guizhou.js')
require('echarts/map/js/province/hainan.js')
require('echarts/map/js/province/hebei.js')
require('echarts/map/js/province/heilongjiang.js')
require('echarts/map/js/province/henan.js')
require('echarts/map/js/province/hubei.js')
require('echarts/map/js/province/hunan.js')
require('echarts/map/js/province/jiangsu.js')
require('echarts/map/js/province/jiangxi.js')
require('echarts/map/js/province/jilin.js')
require('echarts/map/js/province/liaoning.js')
require('echarts/map/js/province/neimenggu.js')
require('echarts/map/js/province/ningxia.js')
require('echarts/map/js/province/qinghai.js')
require('echarts/map/js/province/shanghai.js')
require('echarts/map/js/province/shandong.js')
require('echarts/map/js/province/shanxi.js')
require('echarts/map/js/province/shanxi1.js')
require('echarts/map/js/province/sichuan.js')
require('echarts/map/js/province/taiwan.js')
require('echarts/map/js/province/tianjin.js')
require('echarts/map/js/province/xianggang.js')
require('echarts/map/js/province/xinjiang.js')
require('echarts/map/js/province/xizang.js')
require('echarts/map/js/province/yunnan.js')
require('echarts/map/js/province/zhejiang.js')
export default {
    data () {
        return {
            data: [],
            weiData: [],
            mapData: {},
            areaBig: '',
            areaBlog: 'china',
            cityDataLength: 0,
            firstLength: 0
        }
    },
    created () {
        infraApi.localCity(sessionStorage.getItem('USERID')).then((res) => {
            let localData = res.data.result
            this.areaBlog = localData.REGIONNAME.slice(0, 2)
            infraApi.dapingAllCity(localData.REGIONNO.slice(0, 2)).then(this.handleAllCitySuees.bind(this))
        })
    },
    mounted () {
        // let provinceBig = window.sessionStorage.getItem('provinceId')
        // this.areaBlog = provinceBig
        // let regionBig = window.sessionStorage.getItem('regionId')
        // this.areaBig = regionBig
        // infraApi.dapingAllCity(this.areaBig).then(this.handleAllCitySuees.bind(this))
    },
    methods: {
        handleAllCitySuees (res) {
            let cityData = res.data.result
            this.cityDataLength = Math.floor(res.data.result.length / 3)
            this.firstLength = Math.floor(res.data.result.length / 3)
            let i = 0
            if (cityData) {
                for (i in cityData) {
                    this.data.push({ name: cityData[i].regionName, value: Number(cityData[i].ecardCount), level1: Number(cityData[i].ecardOneCount), level2: Number(cityData[i].ecardTwoCount), regionNo: cityData[i].regionNo })
                    this.weiData.push([Number(cityData[i].longitude), Number(cityData[i].latitude)])
                    this.mapData[cityData[i].regionName] = this.weiData[i]
                }
                this.drawLine()
            }
        },
        drawLine () {
            // 基于准备好的dom，初始化echarts实例
            let that = this
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            let data = this.data
            let geoCoordMap = this.mapData
            let convertData = function (data) {
                var res = []
                for (let i = 0; i < data.length; i++) {
                    let geoCoord = geoCoordMap[data[i].name]
                    if (geoCoord) {
                        res.push({ name: data[i].name, value: geoCoord.concat(data[i].value) })
                    }
                }
                return res
            }
            var option = {
                tooltip: {
                    show: 'true',
                    trigger: 'item',
                    borderType: 'slider',
                    borderWidth: '2',
                    borderColor: '#12ADC7',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params, ticket, callback) {
                        let html = '<div class=\'wpypop_title\'>' + params.data.name + '</div>' + '<ul class=\'wpypop_ul pop_font1\'><li>签发数</li><li>一级签发</li><li>二级签发</li></ul>' + '<ul class=\'wpypop_ul pop_font2\'><li>' + params.data.value + '</li><li>' + params.data.level1 + '</li><li>' + params.data.level2 + '</li></ul>'
                        return html
                    }
                },
                visualMap: {
                    min: 0,
                    max: 1500,
                    left: 'left',
                    top: 'bottom',
                    text: ['High', 'Low'],
                    seriesIndex: [2],
                    show: false,
                    inRange: {
                        color: ['#0F1E55']
                    },
                    calculable: true
                },
                geo: {
                    map: that.areaBlog,
                    zoom: 1.2,
                    roam: true,
                    label: {
                        emphasis: {
                            borderWidth: 1,
                            areaColor: '#02489C',
                            borderColor: '#00DEFF',
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 1,
                            areaColor: '#19287D',
                            borderColor: '#156BD7'
                        },
                        emphasis: {
                            borderWidth: 1,
                            areaColor: '#02489C',
                            borderColor: '#00DEFF'
                        }
                    }
                },
                grid: {
                    containLabel: true,
                    top: '10%',
                    width: '80%',
                    height: '100%'
                },
                series: [
                    {
                        name: 'pm2.5',
                        type: 'scatter',
                        visualMap: false,
                        coordinateSystem: 'geo',
                        data: convertData(data),
                        symbolSize: function (val) { return val[2] / 10000000000 }
                    },
                    {
                        name: 'Top 5',
                        tooltip: { show: false },
                        type: 'effectScatter',
                        clickable: false,
                        visualMap: false,
                        coordinateSystem: 'geo',
                        data: convertData(data.sort(function (a, b) { return b.value - a.value }).slice(0)),
                        symbolSize: function (val) {
                            let wave = 5
                            if (that.firstLength === 0) {
                                if (val[2] <= 100) {
                                    wave = 5
                                } else if (val[2] <= 500) {
                                    wave = 6
                                } else if (val[2] <= 1000) {
                                    wave = 8
                                } else {
                                    wave = 10
                                }
                            } else {
                                that.cityDataLength--
                                if (that.cityDataLength >= 0) {
                                    wave = 10
                                } else if (that.cityDataLength >= that.firstLength * (-1)) {
                                    wave = 8
                                } else {
                                    wave = 5
                                }
                            }
                            return wave
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#f4e925',
                                shadowBlur: 110,
                                shadowColor: '#333'
                            }
                        }
                    },
                    {
                        name: 'categoryA',
                        type: 'map',
                        geoIndex: 0,
                        data: data
                    }
                ]
            }
            myChart.setOption(option)
            myChart.on('click', function (params) {
                if (params.data.regionNo) {
                    window.sessionStorage.setItem('cityId', params.data.name)
                    window.sessionStorage.setItem('cityNumId', params.data.regionNo)
                    window.sessionStorage.setItem('cityTopId', params.data.regionNo)
                    that.$router.push('/cityScreen')
                }
            })
        }
    }
}
</script>
<style scoped>
</style>
