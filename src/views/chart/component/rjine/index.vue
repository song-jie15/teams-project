<template>
    <el-card
        class="container"
        :body-style="{ padding: '18px' }"
    >
        <div class="container" ref="target">

        </div>
    </el-card>
</template>

<script setup>
// 2.导入 在echarts是按需导出的
import * as echarts from 'echarts'
import { onMounted, ref, watch, defineProps } from 'vue';

// 接收来自父组件的数据
const props = defineProps({
    dailyData: {
        type: Array,
        default: () => [
            { timeStr: '0点', income: '2.81', expense: '1.40', balance: '1.41' },
            { timeStr: '3点', income: '3.29', expense: '0.18', balance: '3.11' },
            { timeStr: '6点', income: '1.40', expense: '9.55', balance: '-8.15' },
            { timeStr: '9点', income: '1.78', expense: '6.45', balance: '-4.67' },
            { timeStr: '12点', income: '6.49', expense: '13.44', balance: '-6.95' },
            { timeStr: '15点', income: '7.23', expense: '8.46', balance: '-1.23' },
            { timeStr: '18点', income: '8.70', expense: '5.37', balance: '3.33' },
            { timeStr: '21点', income: '0.16', expense: '6.45', balance: '-6.29' }
        ]
    }
})

// 图标初始化
const target = ref(null)
let mChart = null
onMounted(()=>{
    mChart = echarts.init(target.value)
    renderChart()
})

// 监听数据变化，更新图表
watch(() => props.dailyData, () => {
    renderChart()
}, { deep: true })

// 渲染图标
const renderChart = ()=>{
    // 生成数据
    const timeData = ['0点', '3点', '6点', '9点', '12点', '15点', '18点', '21点']
    
    // 使用父组件传递的数据
    const data = props.dailyData
    
    // 提取数据
    const incomeData = data.map(item => parseFloat(item.income))
    const expenseData = data.map(item => parseFloat(item.expense))
    const balanceData = data.map(item => parseFloat(item.balance))
    
    const options={
        tooltip: {
            trigger: 'axis',
            axisPointer: {  
                type: 'shadow',  
                crossStyle: {
                    color: '#999',
                }
            }
        },
        //图例
        legend: {
            data: ['收益(万元)','支出(万元)','结余(万元)'],
            //位置
            right:0
        },
        grid: {
            top: 28,
            bottom: 0,
            left: 0,
            containLabel: true
        },
        //x轴数据轴
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            //刻度上展示的文字
            axisTick: {
                show: false
            },
            data: timeData,
            inverse: true
        },
        series: [
            {
                name: '收益(万元)',
                type: 'bar',
                stack: 'total',
                emphasis: {
                    focus: 'series'
                },
                data: incomeData,
                itemStyle: {
                    color: '#ccc'
                }
            },
            {
                name: '支出(万元)',
                type: 'bar',
                stack: 'total',
                emphasis: {
                    focus: 'series'
                },
                data: expenseData,
                itemStyle: {
                    color: '#e6a23c'
                }
            },
            {
                name: '结余(万元)',
                type: 'bar',
                stack: 'total',
                emphasis: {
                    focus: 'series'
                },
                data: balanceData,
                itemStyle: {
                    color: '#409eff'
                }
            }
        ]
    }
    mChart.setOption(options)
}
</script>

<style scoped> 
.container{
    width: 100%;
    height: 445px; 
}
</style>