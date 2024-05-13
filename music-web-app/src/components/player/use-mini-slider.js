import { onMounted, onUnmounted, ref, computed, watch, nextTick } from 'vue'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { useMusicPlayStore } from '@/store/musicPlay'
BScroll.use(Slide)

export default function useMiniSlider(prev, next) {
  const sliderRootRef = ref(null)
  const miniSlider = ref(null)
  const musicPlayStore = useMusicPlayStore()
  const fullScreen = computed(() => musicPlayStore.fullScreen)
  const playlist = computed(() => musicPlayStore.playlist)
  const currentIndex = computed(() => musicPlayStore.currentIndex)
  const showSlider = computed(() => !fullScreen.value && (playlist.value.length > 0))


  onMounted(() => {
    let miniSliderVal
    watch(showSlider, async (newV) => {
      if (newV) {
        await nextTick()
        if (!miniSlider.value) {
          miniSliderVal = miniSlider.value = new BScroll(sliderRootRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true,
            },
          })
          miniSliderVal.on('slidePageChanged', page => {
            musicPlayStore.setCurrentIndex(page.pageX)
          })
        } else {
          miniSliderVal.refresh()
        }
        miniSliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    watch(currentIndex, newV => {
      if (showSlider.value && miniSliderVal) {
        miniSliderVal.goToPage(newV, 0, 0)
      }
    })
  })

  onUnmounted(() => {
    if (miniSlider.value) miniSlider.value.destroy()
  })

  return {
    sliderRootRef,
    miniSlider,
    // currentPageIndex,
    showSlider,
  }
}
