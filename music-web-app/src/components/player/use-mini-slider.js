import { onMounted, onUnmounted, ref, computed, watch, nextTick } from 'vue'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { useMusicPlayStore } from '@/store/musicPlay'
BScroll.use(Slide)

export default function useMiniSlider() {
  const sliderRootRef = ref(null)
  const miniSlider = ref(null)
  const musicPlayStore = useMusicPlayStore()
  const fullScreen = computed(() => musicPlayStore.fullScreen)
  const playlist = computed(() => musicPlayStore.playlist)
  const currentIndex = computed(() => musicPlayStore.currentIndex)
  const visible = computed(() => musicPlayStore.playlistPanelVisible)
  const showSlider = computed(() => !visible.value && !fullScreen.value && (playlist.value.length > 0))
  let miniSliderVal
  onMounted(() => {
    watch(() => playlist.value, async newV => {
      if (newV.length > 0) {
        await nextTick()
        // playlist中有数据了，slider有page，此时可以初始化BScroll
        if (!miniSlider.value) {
          // 初次初始化BScroll，也只需初始化一次
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
        } else miniSliderVal.refresh()
      }
    })
    // 当打开playlistPannel，mini播放器的showSlider会关闭，slider还是原来的只是不显示
    // 当关闭playlistPannel，打开mini播放器的面板，不论在playlistPannel中是否切歌
    // 此时都会观测到showSlider的值为true，然后slider切换到与当前播放歌曲匹配的页面
    // 2种情况下slider要有作用，其一当mini播放器出现的时候，slider要到对应的页
    watch(showSlider, async (newV) => {
      if (!newV) return
      if (currentIndex.value < 0 || currentIndex.value >= playlist.value.length) return
      // 如果在playlistPannel中删除了歌曲，那么playlist.vue中v-for渲染slider在DOM中是没问题的
      // 但是在BScroll中，其作用的wrapperRef没更新，所以需要refresh()更新下，
      // 该函数估计是有重新获取DOM的，所以要等待一个nextTick()
      // 更新完slider中的DOM之后跳转到对应的slider页
      await nextTick()
      miniSliderVal.refresh()
      miniSliderVal.goToPage(currentIndex.value, 0, 0)
    })
    // 其二，mini播放器已经出现，当前歌播放结束播放下一首那么slider也需要切换到对应页
    watch(currentIndex, (newV) => {
      if (!showSlider.value) return
      // 最开始点击一首歌时currentIndex变动，playlist变动，等到用户关闭fullScreen此时
      // 早就因为playlist有值而初始化了miniSlider
      // if (!miniSlider.value) return
      if (newV < 0 || newV >= playlist.value.length) return
      miniSliderVal.goToPage(newV, 0, 0)
    })
  })

  // onMounted(() => {
  //   let miniSliderVal
  //   watch(showSlider, async (newV) => {
  //     if (newV) {
  //       await nextTick()
  //       if (!miniSlider.value) {
  //         miniSliderVal = miniSlider.value = new BScroll(sliderRootRef.value, {
  //           click: true,
  //           scrollX: true,
  //           scrollY: false,
  //           momentum: false,
  //           bounce: false,
  //           probeType: 2,
  //           slide: {
  //             autoplay: false,
  //             loop: true,
  //           },
  //         })
  //         miniSliderVal.on('slidePageChanged', page => {
  //           musicPlayStore.setCurrentIndex(page.pageX)
  //         })
  //       } else {
  //         miniSliderVal.refresh()
  //       }
  //       miniSliderVal.goToPage(currentIndex.value, 0, 0)
  //     }
  //   })

  //   watch(currentIndex, newV => {
  //     if (showSlider.value && miniSliderVal) {
  //       miniSliderVal.goToPage(newV, 0, 0)
  //     }
  //   })

  //   watch(playlist, async () => {
  //     if (showSlider.value && miniSliderVal) {
  //       await nextTick()
  //       miniSliderVal.value.refresh()
  //     }
  //   })
  // })

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
