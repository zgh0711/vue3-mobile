<script setup>
import { useRoute } from 'vue-router'

const route = useRoute();
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component
        :is="Component"
        :key="route.path"
        v-if="route.meta.keepAlive"
      />
    </keep-alive>
    <component :is="Component" :key="route.path" v-if="!route.meta.keepAlive" />
  </router-view>
</template>
