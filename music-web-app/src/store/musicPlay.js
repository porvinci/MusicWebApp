import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'

export const useMusicPlayStore = defineStore('musicPlay', () => {
  const sequenceList = ref([]) // 歌手详情页中歌曲的顺序
  const playlist = ref([]) // 播放器的播放列表
  const playMode = ref(PLAY_MODE.sequence) // 播放器的当前播放模式
  const playing = ref(false) // 播放器的当前播放状态
  const currentIndex = ref(0) // 当前播放歌曲的index
  const fullScreen = ref(false) // 播放器是否要全屏
  let currentSong = ref({})

  currentSong = computed(() => {
    // console.log('currentSong', playlist.value[currentIndex.value])
    return playlist.value[currentIndex.value] || {}
  })
  // const setCurrentSong = (item) => { currentSong.value = item }
  const setSequenceList = (list) => { sequenceList.value = list }
  const setPlayList = (list) => { playlist.value = list }
  const setPlayMode = (mode) => { playMode.value = mode } // ; console.log('mode', playMode.value)
  const setPlayingState = (state) => { playing.value = state }
  const setCurrentIndex = (index) => {
    currentIndex.value = index
    // console.log('set index', currentIndex.value)
  }
  const setFullScreen = (state) => { fullScreen.value = state }

  return {
    playlist,
    playing,
    currentIndex,
    fullScreen,
    currentSong,
    // setCurrentSong,
    setSequenceList,
    setPlayList,
    setPlayMode,
    setPlayingState,
    setCurrentIndex,
    setFullScreen
  }
})
