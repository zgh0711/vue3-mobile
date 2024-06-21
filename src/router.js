import { createRouter, createWebHashHistory } from 'vue-router'
import { isInWechat } from '@/utils/util.js'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return {
      top: 0
    } // always scroll to top
  },
  routes: [
    { path: '/', component: () => import('@/views/index.vue') },
    { path: '/WxAuth', name: 'WxAuth', component: () => import('@/views/WxAuth.vue') }
  ]
})

// 页面跳转及微信授权逻辑：
// https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
// 1. 如果不在微信中，则直接跳转
// 2. 如果在微信中，则判断是否已经授权，保存过用户微信信息，如果已经授权，则直接跳转
// 3. 如果在微信中，且没有授权，则拼接授权链接，跳转到授权页面
// 4. 微信授权成功后，会携带 code 跳回 /WxAuth 路由，此时对 wxAuth 路由放行，进入 WxAuth 路由，
// 5. WxAuth 路由中，根据微信返回的 code 调用后端接口获取微信用户信息，保存到 localStorage 中，
// 6. 从 sessionStorage 中取出 wxRedirectUrl ，跳转到之前的页面
router.beforeEach((to, from, next) => {
  if (!isInWechat()) {
    next()
    return
  }

  if (to.name === 'WxAuth') {
    next()
    return
  }

  const wxUserInfo = localStorage.getItem('wxUserInfo')
  if (!wxUserInfo) {
    // 保存当前路由地址，/WxAuth 中获取到微信信息后跳转到该路由
    sessionStorage.setItem('wxRedirectUrl', to.fullPath)

    // 请求微信授权,授权成功后跳回 redirectUrl，这里是 /WxAuth 路由
    //todo 注意修改 appId 和应用访问 URL
    let appId = '测试服AppId'
    let redirectUrl = encodeURIComponent('https://m1.xxxxxx.com/WxAuth')

    // 判断是否为正式环境
    if (window.location.origin.indexOf('https://m.xxxxxx.com') !== -1) {
      appId = '正式服AppId'
      redirectUrl = encodeURIComponent('https://m.xxxxxx.com/WxAuth')
    }
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base#wechat_redirect`
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
