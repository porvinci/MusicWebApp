import { ref, computed } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  const touch = {}

  // const sleep = async function (time) {
  //   new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve()
  //     }, time)
  //   })
  // }

  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index)
    // const targetEl = groupRef.value.children[anchorIndex]
    // scrollRef.value.scroll.scroll.value.scrollToElement(targetEl, 0)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex

    scrollTo(anchorIndex)
  }

  async function onShortcutTouchMove(e) {
    // console.log(e.touches)
    // 当前触摸点相对于整个页面的 Y 坐标
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    console.log(touch.y1, touch.y2, touch.y2 - touch.y1, delta)
    // await sleep(10000)
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex)
  }


  function scrollTo(index) {
    if (isNaN(index)) {
      return
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    scrollRef.value.scroll.scroll.value.scrollToElement(targetEl, 0)
    // const scroll = scrollRef.value.scroll
    // scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
