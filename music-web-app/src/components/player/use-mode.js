import { useMusicPlayStore } from '@/store/musicPlay'
import { PLAY_MODE } from '@/assets/js/constant'
import { computed } from 'vue'
import { shuffle } from '@/assets/js/util'

export default function useMode() {
  const musicPlayStore = useMusicPlayStore()
  const playMode = computed(() => musicPlayStore.playMode)
  const sequenceList = computed(() => musicPlayStore.sequenceList)
  // const playlist = computed(() => musicPlayStore.playlist)

  const modeIcon = computed(() => {
    if (playMode.value === PLAY_MODE.sequence) return 'icon-sequence'
    else if (playMode.value === PLAY_MODE.loop) return 'icon-loop'
    else return 'icon-random'
  })

  const modeText = computed(() => {
    if (playMode.value === PLAY_MODE.sequence) return '顺序播放'
    else if (playMode.value === PLAY_MODE.loop) return '单曲循环'
    else return '随机播放'
  })

  function changeMode() {
    if (playMode.value === PLAY_MODE.sequence) {
      musicPlayStore.setPlayMode(PLAY_MODE.loop)
    } else if (playMode.value === PLAY_MODE.loop) {
      musicPlayStore.setPlayMode(PLAY_MODE.random)
      // const song = musicPlayStore.currentSong.value
      musicPlayStore.setPlayList(shuffle(sequenceList.value))
      // const idx = playlist.value.indexOf(item => item.id === song.id)
      // musicPlayStore.setCurrentIndex(idx)
    } else {
      musicPlayStore.setPlayMode(PLAY_MODE.sequence)
      // const song = musicPlayStore.currentSong.value
      musicPlayStore.setPlayList(sequenceList.value)
      // console.log('musicPlayStore.playlist.value', musicPlayStore.playlist)
      // const idx = playlist.value.indexOf(item => item.id === song.id)
      // musicPlayStore.setCurrentIndex(idx)
    }
  }

  return {
    modeIcon,
    changeMode,
    modeText,
  }
}
