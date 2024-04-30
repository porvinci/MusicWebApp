import { useMusicPlayStore } from '@/store/musicPlay'
import { PLAY_MODE } from '@/assets/js/constant'
import { computed } from 'vue'
import { shuffle } from '@/assets/js/util'

export default function useMode() {
  const musicPlayStore = useMusicPlayStore()
  const playMode = computed(() => musicPlayStore.playMode)
  const currentSong = computed(() => musicPlayStore.currentSong)

  const modeIcon = computed(() => {
    if (playMode.value === PLAY_MODE.sequence) return 'icon-sequence'
    else if (playMode.value === PLAY_MODE.loop) return 'icon-loop'
    else return 'icon-random'
  })

  function changeMode() {
    if (playMode.value === PLAY_MODE.sequence) {
      musicPlayStore.setPlayMode(PLAY_MODE.loop)
    } else if (playMode.value === PLAY_MODE.loop) {
      musicPlayStore.setPlayMode(PLAY_MODE.random)
      const randomList = shuffle(musicPlayStore.sequenceList)
      const index = randomList.findIndex(item => item.mid === currentSong.value.mid)
      musicPlayStore.setPlayList(randomList)
      musicPlayStore.setCurrentIndex(index)
    } else {
      musicPlayStore.setPlayMode(PLAY_MODE.sequence)
      musicPlayStore.setPlayList(musicPlayStore.sequenceList)
    }
  }

  return {
    modeIcon,
    changeMode,
  }
}
