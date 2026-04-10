<template>
    <div class="trend-data-container">
        <!-- 本月累计收益卡片 -->
        <div class="total-income-card">
            <div class="card-label">本月累计收益（万元）</div>
            <div class="card-amount">¥ <span ref="totalAmountRef">284348.43</span></div>
        </div>

        <!-- 今日数据列表 -->
        <div class="today-stats">
            <div class="stat-item">
                <div class="stat-left">
                    <div class="stat-bar blue"></div>
                    <span class="stat-label">今日新增收益</span>
                </div>
                <div class="stat-right">
                    <span class="stat-value" ref="todayIncomeRef">952.92</span>
                    <span class="stat-unit">万元</span>
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-left">
                    <div class="stat-bar orange"></div>
                    <span class="stat-label">今日新增支出</span>
                </div>
                <div class="stat-right">
                    <span class="stat-value" ref="todayExpenseRef">831.52</span>
                    <span class="stat-unit">万元</span>
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-left">
                    <div class="stat-bar green"></div>
                    <span class="stat-label">今日结余</span>
                </div>
                <div class="stat-right">
                    <span class="stat-value" ref="todayBalanceRef">121.40</span>
                    <span class="stat-unit">万元</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CountUp } from 'countup.js'

// 引用DOM元素
const totalAmountRef = ref(null)
const todayIncomeRef = ref(null)
const todayExpenseRef = ref(null)
const todayBalanceRef = ref(null)

onMounted(() => {
    // 初始化CountUp实例
    const totalAmountCountUp = new CountUp(totalAmountRef.value, 284348.43, {
        decimalPlaces: 2, //小数点位
        separator: ',', //
        duration: 2  //持续时间
    })
    
    const todayIncomeCountUp = new CountUp(todayIncomeRef.value, 952.92, {
        decimalPlaces: 2,
        separator: ',',
        duration: 1.5
    })
    
    const todayExpenseCountUp = new CountUp(todayExpenseRef.value, 831.52, {
        decimalPlaces: 2,
        separator: ',',
        duration: 1.5
    })
    
    const todayBalanceCountUp = new CountUp(todayBalanceRef.value, 121.40, {
        decimalPlaces: 2,
        separator: ',',
        duration: 1.5
    })
    
    // 开始动画
    totalAmountCountUp.start()
    todayIncomeCountUp.start()
    todayExpenseCountUp.start()
    todayBalanceCountUp.start()
})
</script>

<style scoped>
.trend-data-container {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 累计收益卡片 */
.total-income-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 24px;
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.card-label {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
}

.card-amount {
    font-size: 32px;
    font-weight: bold;
    letter-spacing: 1px;
}

/* 今日数据列表 */
.today-stats {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
    border-bottom: none;
}

.stat-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.stat-bar {
    width: 4px;
    height: 20px;
    border-radius: 2px;
}

.stat-bar.blue {
    background-color: #409eff;
}

.stat-bar.orange {
    background-color: #e6a23c;
}

.stat-bar.green {
    background-color: #67c23a;
}

.stat-label {
    font-size: 14px;
    color: #606266;
}

.stat-right {
    display: flex;
    align-items: baseline;
    gap: 4px;
}

.stat-value {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
}

.stat-unit {
    font-size: 12px;
    color: #909399;
}
</style>