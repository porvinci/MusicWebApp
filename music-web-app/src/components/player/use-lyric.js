import { useMusicPlayStore } from '@/store/musicPlay'
import { ref, computed, watch, } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric(currentTime) {
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const musicPlayStore = useMusicPlayStore()
  const currentSong = computed(() => musicPlayStore.currentSong)
  const curTime = computed(() => musicPlayStore.currentTime)
  const lyric = ref(null)
  const lineSerialNum = ref(0)
  const lyricTimeList = ref([])
  watch(currentSong, async (newSong) => {
    const originLyric = await getLyric(newSong)
    lyric.value = new Lyric(originLyric)
    lyricTimeList.value = lyric.value.lines.map(item => item.time * 0.001)
    // console.log(originLyric, lyric.value, lyricTimeList.value)
  })
  watch(curTime, (newV) => {
    lineSerialNum.value = lyricTimeList.value.findIndex(item => item > newV) - 1
    const targetEl = lyricListRef.value.children[Math.max(lineSerialNum.value - 7, 0)]
    lyricScrollRef.value.scroll.scroll.value.scrollToElement(targetEl, 0)
  })

  return {
    lyric,
    lineSerialNum,
    lyricScrollRef,
    lyricListRef,
  }
}
