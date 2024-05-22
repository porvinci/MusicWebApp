import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PLAY_MODE, SONG_KEY } from '@/assets/js/constant'
import storage from 'good-storage'

export const useMusicPlayStore = defineStore('musicPlay', () => {
  const sequenceList = ref([]) // 歌手详情页中歌曲的顺序
  const playlist = ref([]) // 播放器的播放列表
  const playMode = ref(PLAY_MODE.sequence) // 播放器的当前播放模式
  const playing = ref(false) // 播放器的当前播放状态
  const currentIndex = ref(0) // 当前播放歌曲的index
  const fullScreen = ref(false) // 播放器是否要全屏
  const favList = ref(storage.get(SONG_KEY, []))
  const currentTime = ref(0)
  let currentSong = ref({})

  currentSong = computed(() => {
    return playlist.value[currentIndex.value] || {}
  })
  // const setCurrentSong = (item) => { currentSong.value = item }
  const setSequenceList = (list) => {
    sequenceList.value = list
  }
  const setPlayList = (list) => {
    playlist.value = list
  }
  const setPlayMode = (mode) => { playMode.value = mode } // ; console.log('mode', playMode.value)
  const setPlayingState = (state) => { playing.value = state }
  const setCurrentIndex = (index) => {
    currentIndex.value = index
    // console.log('set index', currentIndex.value)
  }
  const setFullScreen = (state) => { fullScreen.value = state }
  const setFavList = (list) => { favList.value = list }
  const setCurrentTime = (time) => { currentTime.value = time }
  const deleteSong = (song) => {
    // 删除playlist中的歌曲
    console.log('333')
    const idx = playlist.value.findIndex(item => item.id === song.id)
    console.log('444')
    if (idx === -1) return
    console.log('555')
    playlist.value.splice(idx, 1)
    console.log('666', playlist.value)
  }
  const clearPlayList = () => { playlist.value = [] }

  return {
    sequenceList,
    playlist,
    playMode,
    playing,
    currentIndex,
    fullScreen,
    currentSong,
    favList,
    currentTime,
    // setCurrentSong,
    setSequenceList,
    setPlayList,
    setPlayMode,
    setPlayingState,
    setCurrentIndex,
    setFullScreen,
    setFavList,
    setCurrentTime,
    deleteSong,
    clearPlayList,
  }
})
