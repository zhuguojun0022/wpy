<template>
    <div id="myChartliu" :style="{width: '100%', height: '250px'}"></div>
</template>

<script>
import echarts from 'echarts'
import {formatDate} from './formateDate.js'

export default {
    data () {
        return {
            xdata: [],
            ydata: [],
            stopTime: ''
        }
    },
    mounted () {
        this.stratsData()
        let _this = this
        this.stopTime = setInterval(function () { _this.getData() }, 3000)
        this.drawLine(this.xdata, this.ydata)
    },
    methods: {
        stratsData () {
            let now = new Date().valueOf()
            for (var i = 0; i < 60; i++) {
                let nowTime = new Date(now)
                let lastTime = formatDate(nowTime, 'hh:mm:ss')
                this.xdata.unshift(lastTime)
                now -= 1000
            }
            this.ydata = []
            for (let i = 0; i < 60; i++) {
                let ass = 50
                this.ydata.push(ass + Math.floor(Math.random() * 50))
            }
            this.drawLine(this.xdata, this.ydata)
        },
        getData () {
            let now = new Date().valueOf()
            let nowTime = new Date(now)
            let lastTime = formatDate(nowTime, 'hh:mm:ss')
            this.xdata.shift()
            this.xdata.push(lastTime)
            let ass = 50
            var lastY = Math.floor(ass + Math.random() * 50)
            this.ydata.shift()
            this.ydata.push(lastY)
            this.drawLine(this.xdata, this.ydata)
        },
        drawLine (xdata, ydata) {
            let myChartliu = this.$echarts.init(document.getElementById('myChartliu'))
            let option1 = setOptionBar()
            function setOptionBar () {
                let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['数据量'],
                        textStyle: {
                            fontSize: 12,
                            color: '#FFF'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                fontSize: 5,
                                color: '#FFF'
                            }
                        },
                        scale: false,
                        axisLabel: {
                            interval: 15
                        },
                        splitLine: {
                            show: false
                        },
                        data: xdata
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#FFF'
                            }
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    grid: {
                        containLabel: true,
                        x: '1%',
                        y: '15%',
                        width: '100%',
                        height: '70%'
                    },
                    series: [
                        {
                            name: '数据量',
                            type: 'line',
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#0022AA' }, { offset: 1, color: '#00FFFE' }]),
                            symbol: 'none',
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: 'rgba(255,255,255,0)'
                                    }
                                }
                            },
                            areaStyle: {},
                            data: ydata
                        }
                    ]
                }
                return option
            }
            myChartliu.setOption(option1)
        }
    },
    beforeDestroy () {
        clearInterval(this.stopTime)
        this.stopTime = null
    }
}
</script>
