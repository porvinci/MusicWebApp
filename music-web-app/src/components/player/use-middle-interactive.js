import { ref } from 'vue'
export default function useMiddleInteractive() {
  const currentView = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)
  let startView = 'cd'
  let direction = ''

  const touch = {}
  function onTouchStart(e) {
    touch.x1 = e.touches[0].pageX
    touch.y1 = e.touches[0].pageY
    direction = ''
  }

  function onTouchMove(e) {
    const deltaX = e.touches[0].pageX - touch.x1
    const deltaY = e.touches[0].pageY - touch.y1
    if (!direction) direction = Math.abs(deltaY) > Math.abs(deltaX) ? 'vertical' : 'horizontally'
    if (direction === 'vertical') return
    touch.percent = deltaX / window.innerWidth
    if (startView === 'cd') {
      middleLStyle.value = `opacity: ${1 + touch.percent}`
      middleRStyle.value = `transform: translate3d(${deltaX}px, 0, 0)`
      if (touch.percent < -0.2) currentView.value = 'lyric'
    } else if (startView === 'lyric') {
      middleLStyle.value = `opacity: ${touch.percent}`
      middleRStyle.value = `transform: translate3d(${-window.innerWidth + deltaX}px, 0px, 0px)`
      if (touch.percent > 0.2) currentView.value = 'cd'
    }
  }

  const duration = 300
  function onTouchEnd() {
    if (currentView.value === 'cd') {
      console.log('cd')
      startView = 'cd'
      middleLStyle.value = {
        opacity: 1,
        transitionDuration: `${duration}ms`
      }
      middleRStyle.value = 'transform: translate3d(0px, 0px, 0px)'
    } else {
      console.log('lyric')
      startView = 'lyric'
      middleLStyle.value = 'opacity: 0'
      middleRStyle.value = {
        transform: `translate3d(${-window.innerWidth}px, 0, 0)`,
        transitionDuration: `${duration}ms`
      }
    }
  }

  return {
    currentView,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    middleLStyle,
    middleRStyle,
  }
}
