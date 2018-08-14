<template>
<div id="myChart" :style="{width: '100%', height: '100%'}"></div>
</template>
<script>
import { infraApi } from '../../apis'
require('echarts/map/js/china.js')
export default {
    data () {
        return {
            data: [],
            weiData: [],
            mapData: {},
            areaBig: '',
            areaBlog: 'china'
        }
    },
    mounted () {
        // let provinceBig = window.sessionStorage.getItem("provinceId")
        // this.areaBlog = provinceBig
        // let regionBig = window.sessionStorage.getItem('regionId')
        // this.areaBig = regionBig
        infraApi.dapingAllCity('').then(this.handleAllCitySuees.bind(this))
    },
    methods: {
        handleAllCitySuees (res) {
            let cityData = res.data.result
            let i = 0
            if (cityData) {
                for (i in cityData) {
                    this.data.push({ name: cityData[i].regionName.slice(0, 2), value: Number(cityData[i].ecardCount), level1: Number(cityData[i].ecardOneCount), level2: Number(cityData[i].ecardTwoCount), regionNo: cityData[i].regionNo })
                    this.weiData.push([Number(cityData[i].longitude), Number(cityData[i].latitude)])
                    this.mapData[cityData[i].regionName.slice(0, 2)] = this.weiData[i]
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
                        // console.log("chuancan", params.data.regionNo.slice(0, 3))
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
                    map: 'china',
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
                        symbolSize: function (val) { return val[2] / 100 }
                    },
                    {
                        name: 'Top 5',
                        tooltip: { show: false },
                        type: 'effectScatter',
                        visualMap: false,
                        coordinateSystem: 'geo',
                        data: convertData(data.sort(function (a, b) { return b.value - a.value }).slice(0)),
                        symbolSize: function (val) {
                            console.log(val[2], '涟漪')
                            let wave = 5
                            if (val[2] <= 100) {
                                wave = 5
                            } else if (val[2] <= 500) {
                                wave = 7
                            } else if (val[2] <= 1000) {
                                wave = 9
                            } else {
                                wave = 11
                            }
                            // return val[2] / 100 + 4
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
                // console.log(params.data.name,"wpy")
                //  console.log(params.data.regionNo.slice(0,3),'liaoning')
                that.$router.push('/provinceScreen')
                window.sessionStorage.setItem('provinceId', params.data.name)
                window.sessionStorage.setItem('regionId', params.data.regionNo.slice(0, 3))
                window.sessionStorage.setItem('regionTopId', params.data.regionNo.slice(0, 3))
                // window.sessionStorage.setItem("regionId",params.data.regionNo.slice(0,3))
            })
        }
    }
}
</script>
<style scoped>
</style>
