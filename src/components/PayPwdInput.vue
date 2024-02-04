<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['update:show', 'payPwd'])
const props = defineProps({
  show: {
    required: true,
    default: false
  }
})

const payPwd = ref('')
const showKeyboard = ref(true)
const onOpen = () => {
  payPwd.value = ''
  showKeyboard.value = true
}
const closePopup = () => {
  emit('update:show', false)
}

watch(payPwd, newVal => {
  if (newVal.length === 6) {
    emit('payPwd', newVal)
    closePopup()
  }
})
</script>

<template>
  <van-popup
    v-model:show="props.show"
    @open="onOpen"
    closeable
    @clickOverlay="closePopup"
    @clickCloseIcon="closePopup"
    position="bottom"
    :style="{ height: '400px', background: '#F3F3F3' }">
    <p class="black-6 text-c font-16 text">请输入支付密码</p>
    <!-- 密码输入框 -->
    <van-password-input :value="payPwd" :gutter="10" :focused="showKeyboard" @focus="showKeyboard = true" class="pwd-input" />
    <div class="flex-row p-16">
      <div class="f1"></div>
      <router-link to="/setting/payPwd">
        <van-button plain type="primary" class="btn-link" size="small">忘记密码？</van-button>
      </router-link>
    </div>
    <!-- 数字键盘 -->
    <van-number-keyboard v-model="payPwd" :show="showKeyboard" @blur="showKeyboard = false" />
  </van-popup>
</template>

<style scoped lang="less">
.pwd-input {
  margin-top: 50px;
}
.btn-link{
  background: transparent;
}
.text{
  position: absolute;
  text-align: center;
  width: 100%;
  top: 14px;
}
</style>
