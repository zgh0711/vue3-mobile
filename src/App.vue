<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <router-view v-slot="{ Component }">
    <!--    <keep-alive :include=""></keep-alive>-->
    <component :is="Component" :key="route.path" />
  </router-view>
</template>
