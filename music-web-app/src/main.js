import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createPinia } from 'pinia'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/no-result/no-result'
// import { FAV_KEY, PLAYHISTORY_KEY } from '@/assets/js/constant'
// import storage from 'good-storage'
// import { processSongs } from '@/service/song'

// 引入全局样式文件
import '@/assets/scss/index.scss'

// 更新收藏列表及最近播放历史中的播放资源
// let fL = storage.get(FAV_KEY, [])
// console.log('1')
// if (fL.length > 0) {
//   fL = processSongs(fL)
//   console.log('2')
//   storage.set(FAV_KEY, fL)
// }
// let pH = storage.get(PLAYHISTORY_KEY, [])
// if (pH.length > 0) {
//   pH = processSongs(pH)
//   console.log('3', pH)
//   storage.set(PLAYHISTORY_KEY, pH)
// }

const pinia = createPinia()

createApp(App).use(store).use(pinia).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/default.png'),
}).directive('loading', loadingDirective
).directive('no-result', noResultDirective).mount('#app')
