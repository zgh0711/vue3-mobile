import { ref } from 'vue'

export function useCountdown() {
  const second = ref(60)
  const btnText = ref(`获取验证码`)
  const isDisabled = ref(false)

  function startCountdown (){
    if (isDisabled.value) {
      return
    }

    isDisabled.value = true
    btnText.value = `${second.value}秒`

    const intervalId = setInterval(() => {
      let time = second.value
      time -= 1
      second.value = time
      btnText.value = `${second.value}秒`

      if (time <= 0) {
        clearInterval(intervalId)
        second.value = 60
        btnText.value = `获取验证码`
        isDisabled.value = false
      }
    }, 1000)
  }

  return { btnText, isDisabled, startCountdown }
}
