import http from '@/utils/http.js'

export function useRequest() {
  const loading = ref(false)

  function get(url, successCallback = () => {}, params = {}) {
    request('get', url, params, successCallback)
  }

  function post(url, params = {}, successCallback = () => {}, failCallback = () => {}) {
    request('post', url, params, successCallback, failCallback)
  }

  function request(method, url, params, successCallback, failCallback = () => {}) {
    loading.value = true
    http
      .request(method, url, params)
      .then(res => {
        if (res.code === 0) {
          successCallback(res.data || null)
        }else {
          failCallback(res)
        }
        loading.value = false
      })
      .catch(err => {
        console.error(`请求失败，URL: ${url}`)
        console.error(err)
        failCallback(err)
        loading.value = false
      })
  }

  return { loading, get, post }
}
