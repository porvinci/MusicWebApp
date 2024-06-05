const URL = './sw.js?v=3'
export function register() {
  if ('serviceWorker' in navigator) {
    // 注册Service Worker scope表示作用的页面的path
    // register函数返回Promise
    // navigator.serviceWorker.getRegistrations()
    // .then(regs => {
    //   for (const reg of regs) {
    //     reg.unregister()
    //   }
    // })
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(URL)
      .then(function (registration) {
        console.log('注册成功', registration)
      })
      .catch(function (e) {
        console.log('注册失败')
        console.error(e)
      })
    })
  } else {
    console.log('Service Worker is not supported in this browser.')
  }
}

