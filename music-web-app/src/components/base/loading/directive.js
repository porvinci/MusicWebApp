import { createApp } from 'vue'
import loading from './loading.vue'
const loadingDirective = {
  mounted(el, binding) {
    // 创建组件对应的DOM对象
    const app = createApp(loading)
    const instance = app.mount(document.createElement('div'))
    el.instance = instance
    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  },
}

function append(el) {
  el.appendChild(el.instance.$el)
}

function remove(el) {
  el.removeChild(el.instance.$el)
}

export default loadingDirective
