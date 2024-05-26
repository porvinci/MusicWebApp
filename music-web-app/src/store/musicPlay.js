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
  const playlistPanelVisible = ref(false)
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
    const idx = playlist.value.findIndex(item => item.id === song.id)
    if (idx === -1) return
    playlist.value.splice(idx, 1)
  }
  const clearPlayList = () => { playlist.value = [] }
  const setPlaylistPanelVisible = (state) => { playlistPanelVisible.value = state }
  const addSongToPlaylist = (song) => {
    let idx = playlist.value.findIndex(item => item.id === song.id)
    if (idx !== -1) currentIndex.value = idx
    else {
      playlist.value.push(song)
      currentIndex.value = playlist.value.length - 1
    }
    idx = sequenceList.value.findIndex(item => item.id === song.id)
    if (idx === -1) sequenceList.value.push(song)
  }

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
    playlistPanelVisible,
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
    setPlaylistPanelVisible,
    addSongToPlaylist,
  }
})
