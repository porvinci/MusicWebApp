import animations from 'create-keyframe-animation'
import { ref } from 'vue'

export default function useAnimation() {
  const cdWrapperRef = ref(null)
  let entering = false
  let leaving = false

  function onEnter(el, done) {
    if (leaving) onAfterLeave()
    entering = true
    const { x, y, scale } = calMiniXYandScale()
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
      }
    })
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  function onAfterEnter(el, done) {
    entering = false
    animations.unregisterAnimation('move')
    cdWrapperRef.value.style.animation = ''
  }

  function onLeave(el, done) {
    if (entering) onAfterEnter()
    leaving = true
    const { x, y, scale } = calMiniXYandScale()
    cdWrapperRef.value.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    cdWrapperRef.value.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperRef.value.addEventListener('transitionend', next)
    function next() {
      cdWrapperRef.value.removeEventListener('transitionend', next)
      done()
    }
  }

  function onAfterLeave() {
    leaving = false
    cdWrapperRef.value.style.transform = ''
    cdWrapperRef.value.style.transition = ''
  }

  function calMiniXYandScale() {
    const miniWidth = 20
    const normalWidth = window.innerWidth * 0.8 / 2
    const miniToLeft = 20 + 20
    const miniToBottom = 20 + 10
    const normalToTop = normalWidth + 60 + 20
    const normalToLeft = window.innerWidth / 2
    // x方向要移动的距离
    const x = -(normalToLeft - miniToLeft)
    const y = (window.innerHeight - normalToTop - miniToBottom)
    const scale = miniWidth / normalWidth

    return {
      x,
      y,
      scale
    }
  }

  return {
    cdWrapperRef,
    onEnter,
    onAfterEnter,
    onLeave,
    onAfterLeave
  }
}
