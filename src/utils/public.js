import { showToast } from 'vant'
import http from './http'
import dayjs from 'dayjs'

export const formatDateFull = value => {
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 隐藏手机号中间四位
 * @param value
 * @returns {*|string}
 */
export const hidePhone = value => {
  var talReg = new RegExp('^[1][3,4,5,6,7,8,9][0-9]{9}$')
  var length = value.length
  if (talReg.test(value)) {
    return value.substring(0, 3) + '****' + value.substring(length - 4, length)
  } else {
    return value
  }
}

export const phoneValidator = phone => {
  let reg = /^1[3-9]\d{9}$/
  if (reg.test(phone)) {
    return true
  } else {
    return '手机号格式错误'
  }
}

/**
 * 文件上传时超过最大体积限制时的提示
 * @param size
 */
export const onUploadOversize = size => {
  showToast(`图片大小不能超过 ${size}`)
}

/**
 * 通用上传文件接口，返回 code 用来提交数据
 * @param file
 * @returns {Promise<string>}
 */
export const uploadFile = async file => {
  file.status = 'uploading'
  file.message = '上传中...'

  let code = ''
  let formData = new FormData()
  formData.append('file', file.file)
  await http
    .post('/upload', formData)
    .then(res => {
      if (res.code === 0 && res.data?.code) {
        code = res.data.code
        file.status = 'done'
        file.message = '上传完成'
      } else {
        file.status = 'failed'
        file.message = '上传失败'
      }
    })
    .catch(err => {
      file.status = 'failed'
      file.message = '上传失败'
    })

  return code
}

/**
 * 文件识别
 * @param file 要上传的文件
 * @param type 文件类型：营业执照、身份证、银行卡
 * @returns {Promise<{}>}
 */
export const fileOCR = async (file, type) => {
  let result = null
  let params = new FormData()
  params.append('image', file.file)
  params.append('type', type)
  await http
    .post('/ocr', params)
    .then(res => {
      result = res.data?.result || null
    })
    .catch(res => {
      console.error('ocr error', res)
    })

  return result
}

export const copyText = content => {
  let aux = document.createElement('input')
  aux.setAttribute('value', content)
  document.body.appendChild(aux)
  aux.select()
  document.execCommand('copy')
  document.body.removeChild(aux)
}

/**
 * 详情页面，给各项 item 赋值
 * @param item
 * @param data
 */
export const setDetailValues = (item, data) => {
  const timeFields = ['created', 'payed', 'confirmed', 'processed']
  for (const key in data) {
    if (item.name === key) {
      if (typeof data[key] === 'string' || typeof data[key] === 'number') {
        item.value = data[key]
        if (timeFields.includes(key)) {
          item.value = formatDateFull(data[key])
        }
        continue
      }
      if (typeof data[key] === 'object' && data[key] !== null) {
        item.value = data[key]?.label || ''
      }
    }

    // 有两层对象的情况，从第二层对象取值
    if (item.name.split('.').length === 2) {
      let key1 = item.name.split('.')[0]
      let key2 = item.name.split('.')[1]
      item.value = data[key1][key2]
      if (timeFields.includes(key2)) {
        item.value = formatDateFull(data[key1][key2])
      }
    }
  }

  // type === decimal 的字段，保留两位小数
  if (item.type === 'decimal') {
    item.value = (item.value || 0).toFixed(2)
  }
}

/**
 * 获取浏览器类型: 微信、支付宝、其他
 * @returns {string}
 */
export const getBrowserType = () => {
  if (/MicroMessenger/i.test(window.navigator.userAgent)) {
    return 'wechat'
  } else if (/AlipayClient/i.test(window.navigator.userAgent)) {
    return 'alipay'
  } else {
    return 'other'
  }
}
