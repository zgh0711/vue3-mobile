<script setup>
const emit = defineEmits(['update:show'])
const props = defineProps({
  show: {
    required: true,
    default: false
  }
})

const closePopup = () => {
  emit('update:show', false)
}
</script>

<template>
  <van-popup v-model:show="props.show" @clickOverlay="closePopup" :style="{ background: 'transparent' }">
    <div class="con-popup">
      <div class="content">
        <img @click="closePopup" class="ic-close" src="/icons/close_circle.png" alt="" />
        <slot></slot>
      </div>
    </div>
  </van-popup>
</template>

<style scoped lang="less">
.van-popup--center {
  max-width: 100vw;
}
.con-popup {
  padding: 30px 24px;
  background: transparent;
  .content {
    width: 320px;
    position: relative;
    background: white;
    border-radius: 8px;
    .ic-close {
      width: 24px;
      height: 24px;
      position: absolute;
      top: -30px;
      right: -12px;
    }
  }
}
</style>
