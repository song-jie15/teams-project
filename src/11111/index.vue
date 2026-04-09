<template>
  <div class="top">
    <!-- 左侧菜单栏 -->
    <Siderbar class="siderbar" :style="{backgroundColor: variables.menuBg}" />
    <div class="content">
      <div class="fixed-header">
        <!-- 顶部导航栏 -->
        <Navbar />
      </div>
      <div>
        <!-- 主内容区域 -->
        <AppMain />
      </div>
    </div>
  </div>
</template>
<script setup>
import Navbar from './layout/Navbar.vue'
import Siderbar from './layout/siderbar/index.vue'
import AppMain from './layout/AppMain.vue'
import variables from '@/styles/variables.scss' 


</script>
<style lang="scss" scoped>
@import '~@/styles/mixin.scss' ;
@import '~@/styles/variables.scss';
.top{
  @include clearfix ;
  position: relative;
  height: 100%;
  width: 100%;
}
.fixed-header{
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width:calc(100% - #{$siderbar-width});
}
</style>
