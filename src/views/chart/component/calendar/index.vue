<template>
    <el-card
        class="container"
        :body-style="{ padding: '0' }"
    >
         <el-calendar v-model="value" class="calendar">
            <!-- 命名插槽 -->
            <template #date-cell="{ data }">
                <div :class="getCellClass(data.day)" @click="handleDateClick(data.day)">
                    <div class="day-number">{{ getDayNumber(data.day) }}</div>
                    <div class="amount" v-if="getAmount(data.day) !== null">
                        {{ getAmount(data.day) }}
                    </div>
                </div>
            </template>
         </el-calendar>
    </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['date-click'])

const value = ref(new Date('2026-04-09'))

// 处理日期点击事件
const handleDateClick = day => {
    emit('date-click', day)
}

// 模拟日历数据 - 2026年3月到4月
const calendarData = {
    // 3月数据
    '2026-03-01': { amount: 18.50 },
    '2026-03-02': { amount: 25.30 },
    '2026-03-03': { amount: 32.15 },
    '2026-03-04': { amount: 15.80 },
    '2026-03-05': { amount: 28.90 },
    '2026-03-06': { amount: 12.40 },
    '2026-03-07': { amount: 35.60 },
    '2026-03-08': { amount: 8.25 },
    '2026-03-09': { amount: 42.30 },
    '2026-03-10': { amount: 19.75 },
    '2026-03-11': { amount: 31.20 },
    '2026-03-12': { amount: 14.60 },
    '2026-03-13': { amount: -5.80 },
    '2026-03-14': { amount: 27.90 },
    '2026-03-15': { amount: 22.15 },
    '2026-03-16': { amount: 38.40 },
    '2026-03-17': { amount: 16.70 },
    '2026-03-18': { amount: 29.85 },
    '2026-03-19': { amount: 11.30 },
    '2026-03-20': { amount: 45.20 },
    '2026-03-21': { amount: -3.50 },
    '2026-03-22': { amount: 33.75 },
    '2026-03-23': { amount: 20.40 },
    '2026-03-24': { amount: 26.90 },
    '2026-03-25': { amount: 17.60 },
    '2026-03-26': { amount: 39.25 },
    '2026-03-27': { amount: 13.80 },
    '2026-03-28': { amount: 30.50 },
    '2026-03-29': { amount: 24.15 },
    '2026-03-30': { amount: 36.70 },
    '2026-03-31': { amount: 9.40 },
    // 4月数据
    '2026-04-01': { amount: 28.30 },
    '2026-04-02': { amount: 41.60 },
    '2026-04-03': { amount: 15.90 },
    '2026-04-04': { amount: 33.25 },
    '2026-04-05': { amount: 19.70 },
    '2026-04-06': { amount: 37.80 },
    '2026-04-07': { amount: 22.40 },
    '2026-04-08': { amount: 44.50 },
    '2026-04-09': { amount: 11.20 },
    '2026-04-10': { amount: 29.60 },
    '2026-04-11': { amount: 35.90 },
    '2026-04-12': { amount: 18.30 },
    '2026-04-13': { amount: -7.20 },
    '2026-04-14': { amount: 26.80 },
    '2026-04-15': { amount: 40.15 },
    '2026-04-16': { amount: 14.50 }
}

// 获取日期数字
const getDayNumber = (day: string)=> {
    const date = new Date(day)
    return date.getDate()
}

// 获取金额
const getAmount = (day: string) => {
    const data = calendarData[day]
    return data ? data.amount.toFixed(2) : null
}

// 获取单元格样式类
const getCellClass = (day: string) => {
    const data = calendarData[day]
    if (!data) return 'cell-content'
    
    const classes = ['cell-content']
    if (data.amount > 0) {
        classes.push('profit')
    } else if (data.amount < 0) {
        classes.push('loss')
    }
    return classes.join(' ')
}
</script>

<style scoped> 
.container {
    width: 100%;
    height: 443px; 
    background-color: #ccc;
}

.calendar {
    height: 100%;
}

.calendar :deep(.el-calendar__body) {
    padding: 0 12px 12px;
    font-size: 14px;
}

.calendar :deep(.el-calendar-day) {
    height: 66px !important;
    padding: 0 !important;
}

.cell-content {
    height: 100%;
    padding: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.day-number {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 2px;
}

.amount {
    font-size: 10px;
    color: #666;
}

/* 正收益 */
.profit {
    background-color: #f3fff3;
}

.profit .amount {
    color: #649840;
}

/* 负收益 */
.loss {
    background-color: #ffe7e7;
}

.loss .amount {
    color: #b65d59;
}

/* 选中状态 */
.is-selected {
    background-color: #d6f2ff;
}
</style>