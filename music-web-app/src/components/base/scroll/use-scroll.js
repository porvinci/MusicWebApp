import BScroll from '@better-scroll/core'
import { ObserveDom } from 'better-scroll'
import { onMounted, onUnmounted, ref } from 'vue'
// onActivated, onDeactivated,
BScroll.use(ObserveDom)

export default function useScroll(wrapperRef, options) {
  const scroll = ref(null)

  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  // onActivated(() => {
  //   slider.value.enable()
  //   slider.value.refresh()
  // })

  // onDeactivated(() => {
  //   slider.value.disable()
  // })

  return {
    scroll,
  }
}
