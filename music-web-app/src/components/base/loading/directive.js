import { createApp } from 'vue'
import loading from './loading.vue'
import { addClass, removeClass } from '@/assets/js/dom'
const relativeCls = 'g-relative'

const loadingDirective = {
  mounted(el, binding) {
    // 创建组件对应的DOM对象
    const app = createApp(loading)
    const instance = app.mount(document.createElement('div'))
    el.instanceLoading = instance
    const title = binding.arg
    if (typeof title !== 'undefined') {
      instance.setTitle(title)
    }
    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    const title = binding.arg
    if (typeof title !== 'undefined') {
      el.instanceLoading.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  },
}

function append(el) {
  const style = getComputedStyle(el)
  if (['absolute', 'relative', 'fixed'].indexOf(style.position) === -1) {
    addClass(el, relativeCls)
  }
  el.appendChild(el.instanceLoading.$el)
}

function remove(el) {
  removeClass(el, relativeCls)
  el.removeChild(el.instanceLoading.$el)
}

export default loadingDirective
