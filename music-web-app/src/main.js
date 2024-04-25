import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createPinia } from 'pinia'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/no-result/no-result'

// 引入全局样式文件
import '@/assets/scss/index.scss'

const pinia = createPinia()

createApp(App).use(store).use(pinia).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/default.png'),
}).directive('loading', loadingDirective
).directive('no-result', noResultDirective).mount('#app')
