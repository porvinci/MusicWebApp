import { useMusicPlayStore } from '@/store/musicPlay'
import { ref, computed, watch } from 'vue'
import { getLyric } from '@/service/song'
import LyricParser from 'lyric-parser'

export default function useLyric() {
  const musicPlayStore = useMusicPlayStore()
  const currentSong = computed(() => musicPlayStore.currentSong)
  const lyric = ref(null)
  watch(currentSong, async (newSong) => {
    const originLyric = await getLyric(newSong)
    lyric.value = new LyricParser(originLyric)
  })
  return {
    lyric
  }
}
