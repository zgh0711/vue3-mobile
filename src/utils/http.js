import axios from 'axios'
import router from '/src/router.js'
import { dehash64 } from './util'
import { useStore } from '../store'
import { closeToast, showLoadingToast, showToast } from 'vant'

if (window.timeout) {
  axios.defaults.timeout = window.timeout
}
axios.defaults.withCredentials = true
axios.defaults.headers.common['ajax'] = 'axios'

axios.interceptors.request.use(config => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  })
  return config
}, err => {
  showToast('请求超时')
  return Promise.reject(err)
})

axios.interceptors.response.use(res => {
  closeToast()

  const code = res.status
  const json = http.decoding(res.data || null)
  switch (code) {
    case 401:
      router.push('/login')
      break
    default:
      if (json.code !== 0 && json.text) {
        showToast(json.text)
      }
      break
  }

  return json
}, err => {
  closeToast()

  if (err && err.response) {
    let json = http.decoding(err.response.data)
    if (json.text) {
      showToast(json.text)
    }
    if (json.code === 204) { //微信授权
      location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + json.data.appid + '&redirect_uri=' + encodeURI(json.data.callback) + '&response_type=code&scope=snsapi_userinfo&state=' + encodeURI(location.href) + '#wechat_redirect'
    }
  }
  return Promise.reject(err)
})


const http = {
  request(method, url, data, config) {
    const store = useStore()

    config = config || {}
    config.method = method
    config.url = url

    //是否自接口请求
    let own = false
    if (url.startsWith('/')) {
      own = true
      if (window.baseUrl) {
        config.url = window.baseUrl + url
      }
    }

    const caseMethod = method.toUpperCase()
    if (caseMethod === 'GET' || caseMethod === 'DELETE') {
      config.params = data || {}
    } else {
      config.data = data || {}
    }
    config.headers = config.headers || {}

    if (own) {
      let token = store.getToken()
      if (token) {
        config.headers.Authorization = token
      }
    }

    return axios(config)
  },

  get(url, data, config) {
    return http.request('get', url, data, config)
  },
  post(url, data, config) {
    if (data instanceof FormData) {
      config = config || {}
      config.headers = config.headers || {}
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    return http.request('post', url, data, config)
  },
  upload(url, data, config) {
    config = config || {}
    config.headers = config.headers || {}
    config.headers['Content-Type'] = 'multipart/form-data' //强制使用form-data

    return http.request('post', url, data, config)
  },
  put(url, data, config) {
    if (data instanceof FormData) {
      config = config || {}
      config.headers = config.headers || {}
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    return http.request('put', url, data, config)
  },
  delete(url, data, config) {
    return http.request('delete', url, data, config)
  },
  apiUrl(path) {
    if (window.baseUrl) {
      return window.baseUrl + path
    }
    if (window.apiUrl) {
      return window.apiUrl + path
    }
    return path
  },
  appUrl(path) {
    if (window.appUrl) {
      return window.appUrl + path
    }
    return path
  },
  decoding(json) {
    //请求解密
    if (json.data && typeof json.data === 'string') {
      let s = dehash64(json.data)
      // console.log('密串1', s);
      json.data = JSON.parse(s)
      // console.log('解密2', json.data)
    }
    return json
  }
}

export default http
