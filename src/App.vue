<template>
  <router-view v-slot="{ Component }">
    <FadeInOut entry="left" exit="left" :duration="500" mode="out-in">
      <component :is="Component" />
    </FadeInOut>
  </router-view>
</template>

<script setup>
import { defineComponent } from 'vue'
import { FadeInOut } from 'vue3-transitions'
defineComponent({
  components: { FadeInOut }
})
</script>

<style></style>
