<template>
    <el-card class="container">
        <el-row :gutter="32">
            <el-col :span="6">
                <TrendData />
            </el-col>
            <el-col :span="18">
                <TrendTable />
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import TrendData from './trand-Data.vue'
import TrendTable from './trand-Table.vue'
</script>

<style scoped> 
.container{
    height: 280px; 
    /* background-color: #ccc; */
}
</style>