import { useMusicPlayStore } from '@/store/musicPlay'
import { ref, computed, watch, nextTick } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric() {
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const musicPlayStore = useMusicPlayStore()
  const currentSong = computed(() => musicPlayStore.currentSong)
  const curTime = computed(() => musicPlayStore.currentTime)
  const fullScreen = computed(() => musicPlayStore.fullScreen)
  const lyric = ref(null)
  const lineSerialNum = ref(0)
  const lyricTimeList = ref([])
  const pureMusicLyric = ref('')
  const singleLineLyric = ref('')
  watch(currentSong, async (newSong) => {
    singleLineLyric.value = ''
    const originLyric = await getLyric(newSong)
    lyric.value = new Lyric(originLyric)
    if (lyric.value.lines.length) lyricTimeList.value = lyric.value.lines.map(item => item.time * 0.001)
    else singleLineLyric.value = pureMusicLyric.value = originLyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    // console.log(originLyric, lyric.value, lyricTimeList.value)
  })
  watch(curTime, async (newV) => {
    if (!fullScreen.value) return
    const idx = lyricTimeList.value.findIndex(item => item > newV)
    lineSerialNum.value = idx === -1 ? lyricTimeList.value.length - 1 : idx - 1
    singleLineLyric.value = lyric.value.lines[lineSerialNum.value]?.txt
    await nextTick()
    const targetEl = lyricListRef.value.children[Math.max(lineSerialNum.value - 7, 0)]
    if (!targetEl) return
    lyricScrollRef.value.scroll.scroll.value.scrollToElement(targetEl, 0)
  })

  return {
    lyric,
    lineSerialNum,
    lyricScrollRef,
    lyricListRef,
    pureMusicLyric,
    singleLineLyric,
  }
}
