<script setup>
import { showImagePreview } from 'vant'

defineProps({
  data: {
    required: true,
    default: []
  }
})
</script>

<template>
  <van-cell v-for="item in data" class="cell" :title="item.title" :value="item.value">
    <template #value v-if="item.type === 'img' && item.data?.length">
      <van-button @click="showImagePreview(item.data)" plain type="primary" class="btn-link">查看</van-button>
    </template>
    <template #value v-if="item.type === 'custom'">
      <slot name="custom" :item="item"></slot>
    </template>
  </van-cell>
</template>

<style scoped lang="less"></style>
