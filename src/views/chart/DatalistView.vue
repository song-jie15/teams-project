<template>
    <div class="chart-container">
        <!-- 累计收益趋势图 -->
        <TrendChart />

        <!-- 第二行 -->
         <el-row class="mt-20" :gutter="20">
            <el-col :span="16">
                <!-- 日金额分析图 -->
                <rjine :dailyData="selectedDateData" />
            </el-col>
            <el-col :span="8">
                <!-- 日历图 -->
                <calendar @date-click="handleDateClick" />
            </el-col>
         </el-row>
         
         <!-- 第三行 -->
         <!-- <el-row class="mt-20" :gutter="20"> -->
            <!-- <el-col :span="8"> -->
                <!-- <div> -->
                    
                     <!-- <piechart /> -->
                     <!-- 云图 -->
                     <!-- <cloud class="mt-20" /> -->
                <!-- </div> -->
            <!-- </el-col> -->
            <!-- <el-col :span="16"> -->
                <!-- 地图可视化 -->
                <!-- <MapChart />
            </el-col>
         </el-row> -->

         <!-- S2表格数据格式 -->
         <!-- <TableDataChart class="mt-20" />  -->
    </div>
</template>

<script setup>
import { ref } from 'vue'
import TrendChart from '../chart/component/trend/index.vue'
import rjine from '../chart/component/rjine/index.vue'
import calendar from '../chart/component/calendar/index.vue'
import piechart from '../chart/component/piechart/index.vue'
import cloud from '../chart/component/cloud/index.vue'
import TableDataChart from '../chart/component/tableData/index.vue'

// 存储选中的日期
const selectedDate = ref('2026-04-09')

// 存储选中日期的日金额数据
const selectedDateData = ref([
    { timeStr: '0点', income: '2.81', expense: '1.40', balance: '1.41' },
    { timeStr: '3点', income: '3.29', expense: '0.18', balance: '3.11' },
    { timeStr: '6点', income: '1.40', expense: '9.55', balance: '-8.15' },
    { timeStr: '9点', income: '1.78', expense: '6.45', balance: '-4.67' },
    { timeStr: '12点', income: '6.49', expense: '13.44', balance: '-6.95' },
    { timeStr: '15点', income: '7.23', expense: '8.46', balance: '-1.23' },
    { timeStr: '18点', income: '8.70', expense: '5.37', balance: '3.33' },
    { timeStr: '21点', income: '0.16', expense: '6.45', balance: '-6.29' }
])

// 处理日期点击事件
const handleDateClick = (date) => {
    selectedDate.value = date
    // 根据选中的日期生成对应的日金额数据
    generateDailyData(date)
}

// 根据日期生成日金额数据
const generateDailyData = (date) => {
    // 这里可以根据日期从后端获取数据
    // 现在模拟生成数据
    const baseAmount = parseFloat(date.split('-')[2]) * 10
    
    selectedDateData.value = [
        { timeStr: '0点', income: (baseAmount * 0.1 + Math.random() * 2).toFixed(2), expense: (baseAmount * 0.05 + Math.random() * 1).toFixed(2), balance: (baseAmount * 0.05 + Math.random() * 1).toFixed(2) },
        { timeStr: '3点', income: (baseAmount * 0.15 + Math.random() * 2).toFixed(2), expense: (baseAmount * 0.08 + Math.random() * 1).toFixed(2), balance: (baseAmount * 0.07 + Math.random() * 1).toFixed(2) },
        { timeStr: '6点', income: (baseAmount * 0.2 + Math.random() * 2).toFixed(2), expense: (baseAmount * 0.15 + Math.random() * 1).toFixed(2), balance: (baseAmount * 0.05 + Math.random() * 1).toFixed(2) },
        { timeStr: '9点', income: (baseAmount * 0.25 + Math.random() * 2).toFixed(2), expense: (baseAmount * 0.2 + Math.random() * 1).toFixed(2), balance: (baseAmount * 0.05 + Math.random() * 1).toFixed(2) },
        { timeStr: '12点', income: (baseAmount * 0.3 + Math.random() * 2).toFixed(2), expense: (baseAmount * 0.25 + Math.random() * 1).toFixed(2), balance: (baseAmount * 0.05 + Math.random() * 1).toFixed(2) },
        { timeStr: '15点', income: (baseAmount * 0.25 + Math.random() * 2).toFixed(2), expense: (baseAmount * 0.2 + Math.random() * 1).toFixed(2), balance: (baseAmount * 0.05 + Math.random() * 1).toFixed(2) },
        { timeStr: '18点', income: (baseAmount * 0.2 + Math.random() * 2).toFixed(2), expense: (baseAmount * 0.15 + Math.random() * 1).toFixed(2), balance: (baseAmount * 0.05 + Math.random() * 1).toFixed(2) },
        { timeStr: '21点', income: (baseAmount * 0.15 + Math.random() * 2).toFixed(2), expense: (baseAmount * 0.1 + Math.random() * 1).toFixed(2), balance: (baseAmount * 0.05 + Math.random() * 1).toFixed(2) }
    ]
}
</script>

<style>
.chart-container{
    width: 100%;
    height: 100%;
}
.chart-container .container{
    width: 100%;
}
.mt-20{
    margin-top: 20px;
}
</style>