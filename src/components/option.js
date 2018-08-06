/**
 * Created by rm on 2018/7/18.
 * ecardCount:"49"ecardOneCount:"32"ecardTwoCount:"17"regionName:"辽宁省"
 * channelName:"其他"ecardCount:"26"ecardOneCount:"14"ecardTwoCount:"12"ratio:"13.61%"
 */

// 柱状图
export const setOptionBar =function setOptionBar(datas) {
    var xdata=[],ydata=[],i = 0;
    if(datas){
        for(i in datas){
            xdata.push(datas[i].regionName);
            ydata.push(datas[i].ecardCount);
        }
    }
     var option = {
        xAxis: {
            type: 'category',
            data: xdata,
            name:'(地区)',
            axisLine:{
                lineStyle:{
                    color:'#FFF'
                }},
            splitLine:{
                show:false
            }
        },
        grid:{
            containLabel:true,
            top:'20%',
            x:'2%',
            width :'80%',
            height:'70%'
        },
        yAxis: {
            type: 'value',
            name:'(万张)',
            axisLine:{
                lineStyle:{
                    color:'#FFF'
                }},
            splitLine:{
                show:false
            }
        },
        tooltip: {
            show:'true',
            trigger: 'axis',
            borderType:'slider',
            borderWidth:'2',
            borderColor:'#12ADC7',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params, ticket, callback) {
                var html="<div class='pop_title'>"+datas[params[0].dataIndex].regionName+"</div>"+
                    "<ul class='pop_ul pop_font1'><li>签发数</li><li>一级签发</li><li>二级签发</li></ul>"+
                    "<ul class='pop_ul pop_font2'><li>"+datas[params[0].dataIndex].ecardCount+"</li><li>"+datas[params[0].dataIndex].ecardOneCount+"</li><li>"+datas[params[0].dataIndex].ecardTwoCount+"</li></ul>";
                return html;
            }
        },
        series: [{
            data: ydata,
            type: 'bar',
            color:'#156BD7',
            barWidth : 15,
        }]
    };
     return option;
}
//饼状图
export const setOptionPie =function setOptionPie(datas) {
    var colors=['#2563B4','#1E78D9','#3A92C0','#62BAB9','#6BD1E3'];
    var peidata=[];
    if(datas){
        var arr="",i = 0;
        for(i in datas){
            arr={value:datas[i].ecardCount, name:datas[i].channelName,itemStyle:{color:colors[i]}}
            peidata.push(arr);
        }
    }
    var option = {
        tooltip : {
            show:'true',
            trigger: 'item',
            borderType:'slider',
            borderWidth:'2',
            borderColor:'#12ADC7',
            axisPointer: {
                type: 'shadow'
            },
          
            formatter: function(params, ticket, callback) {
                var html="<div class='pop_title'>"+datas[params.dataIndex].channelName+"</div>"+
                    "<ul class='pop_ul pop_font1'><li>签发数</li><li>一级签发</li><li>二级签发</li></ul>"+
                    "<ul class='pop_ul pop_font2'><li>"+datas[params.dataIndex].ecardCount+"</li><li>"+datas[params.dataIndex].ecardOneCount+"</li><li>"+datas[params.dataIndex].ecardTwoCount+"</li></ul>";
                return html;
            }
        },
        // grid:{
        //     // containLabel:true,
        //     top:'50%',
        //     width :'10%',
        //     height:'100%'
        // },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '33%',
                center: ['50%', '50%'],
                data:peidata,
                labelLine:{  
                    normal:{  
                        length:0
                    }  
                },  
                itemStyle: {
                    normal:{
                        label:{
                            color:'#FFFFFF',
                            textStyle: {
                                fontSize: 8
                            },
                        }
                    }
                }
            }
        ]
    };
 return option;
}