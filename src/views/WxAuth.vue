<template>
  <div />
</template>

<script setup>
/**
 * 微信网页授权
 */
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import http from '@/utils/http.js'

onBeforeMount(async () => {
  // 如果连接中有微信返回的 code，则用此 code 调用后端接口，向微信服务器请求用户信息
  // 如果不是从微信重定向过来的，没有带着微信的 code，则直接进入首页
  const code = useRoute().query.code
  if (code) {
    const res = await http.get('/wx/auth', { code })
    if (res && res.success && res.result) {
      localStorage.setItem('wxUserInfo', JSON.stringify(res.result))
    }
    const redirectUrl = sessionStorage.getItem('wxRedirectUrl')
    this.$router.replace(redirectUrl)
  } else {
    this.$router.replace('/')
  }
})
</script>
