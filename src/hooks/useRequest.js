import { ref } from 'vue'
import http from '@/utils/http.js'

export function useRequest() {
  const loading = ref(false)

  function get(url, successCallback, params = {}) {
    request('get', url, successCallback, params)
  }

  function post(url, successCallback, params = {}) {
    request('post', url, successCallback, params)
  }

  function request(method, url, successCallback, params = {}) {
    loading.value = true
    http
      .request(method, url, params)
      .then(res => {
        if (res.code === 0) {
          successCallback(res.data || null)
        }
        loading.value = false
      })
      .catch(err => {
        loading.value = false
      })
  }

  return { loading, get, post }
}
