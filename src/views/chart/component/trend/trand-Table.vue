<template>
    <div class="container">
        <!-- 创建DOM容器 -->
         <div class="trand-table" ref="target">

         </div>
    </div>
</template>

<script setup>
// 2.导入 在echarts是按需导出的
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue';

//3..init(target)  获取mChart实例
const target = ref(null)
let mChart = null
onMounted(()=>{
    mChart = echarts.init(target.value)
    renderChart()
})

const renderChart = ()=>{
    //构建options配置对象 决定这个图标以什么形式呈现出来 (整个echarts渲染核心)
    const options = {
        title: {
            text: '累计收益趋势图',
            left: 'center'
        },
        //提示框
        tooltip: {
            //鼠标移入到坐标轴 触发提示
            trigger: 'axis',
            //移入坐标轴 提示框显示内容的配置
            axisPointer: {  
                //显示十字准星
                type: 'cross',  
                crossStyle: {
                    //色值
                    color: '#999',
                }
            }
        },
        //图例配置
        legend: {
            data: ['累计收益','日收益曲线'],
            //位置
            right:0
        },
        //x轴
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        //y轴
        yAxis: {
            type: 'value',
            //刻度上展示的文字
            axisLabel: {
                formatter: function (value) {
                    return value + '万元';
                }
            }
        },
        series: [
            //柱状图
            {
                data: [120, 200, 150, 80, 70, 110],
                type: 'bar',
                //名称
                name:'累计收益',
                barWidth: 30,
                //提示框的配置
                tooltip:{
                    valueFormatter: function (value) {
                        return value + '万元';
                    }
                }
            },
            //曲线图
            {
                data: [120, 200, 150, 80, 70, 110],
                type: 'line',
                color:'#6EC6D0',
                //名称
                name:'日收益曲线',
                //平滑处理
                smooth: true,
                //提示框的配置
                tooltip:{
                    valueFormatter: function (value) {
                        return value + '万元';
                    }
                }
            }
        ]
    }
    mChart.setOption(options)
}
</script>

<style>
.trand-table{
    height: 100%;
}
</style>