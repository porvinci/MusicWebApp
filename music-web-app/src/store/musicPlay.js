import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { PLAY_MODE, FAV_KEY, PLAYHISTORY_KEY, HISTORY_KEY } from '@/assets/js/constant'
import storage from 'good-storage'

export const useMusicPlayStore = defineStore('musicPlay', () => {
  const sequenceList = ref([]) // 歌手详情页中歌曲的顺序
  const playlist = ref([]) // 播放器的播放列表
  const playMode = ref(PLAY_MODE.sequence) // 播放器的当前播放模式
  const playing = ref(false) // 播放器的当前播放状态
  const currentIndex = ref(0) // 当前播放歌曲的index
  const fullScreen = ref(false) // 播放器是否要全屏
  const favList = ref(storage.get(FAV_KEY, []))
  const playHistory = ref(storage.get(PLAYHISTORY_KEY, []))
  const searchHistory = ref(storage.session.get(HISTORY_KEY, []))
  const currentTime = ref(0)
  const playlistPanelVisible = ref(false)
  let currentSong = ref({})

  currentSong = computed(() => {
    return playlist.value[currentIndex.value] || {}
  })

  watch(() => playHistory.value, val => {
    storage.set(PLAYHISTORY_KEY, val)
  }, { deep: true })

  const setSequenceList = (list) => {
    sequenceList.value = JSON.parse(JSON.stringify(list))
  }
  const setPlayList = (list) => {
    playlist.value = JSON.parse(JSON.stringify(list))
  }
  const addPlayList = song => {
    let idx = playlist.value.findIndex(item => item.id === song.id)
    if (idx !== -1) currentIndex.value = idx
    else {
      playlist.value.push(song)
      currentIndex.value = playlist.value.length - 1
    }
    idx = sequenceList.value.findIndex(item => item.id === song.id)
    if (idx === -1) sequenceList.value.push(song)
  }
  const setPlayMode = (mode) => { playMode.value = mode }
  const setPlayingState = (state) => { playing.value = state }
  const setCurrentIndex = (index) => {
    currentIndex.value = index
  }
  const setFullScreen = (state) => { fullScreen.value = state }
  const setFavList = (list) => { favList.value = JSON.parse(JSON.stringify(list)) }
  const addPlayHistory = song => {
    const idx = playHistory.value.findIndex(item => item.id === song.id)
    if (idx !== -1) {
      playHistory.value.splice(idx, 1)
    }
    playHistory.value.unshift(song)
  }
  const addSearchHistory = hist => {
    const idx = searchHistory.value.findIndex(item => item === hist)
    if (idx !== -1) searchHistory.value.splice(idx, 1)
    searchHistory.value.unshift(hist)
    storage.session.set(HISTORY_KEY, searchHistory.value)
  }
  const setCurrentTime = (time) => { currentTime.value = time }
  const deleteSong = (song) => {
    // 删除playlist中的歌曲
    let idx = playlist.value.findIndex(item => item.id === song.id)
    if (idx === -1) return
    playlist.value.splice(idx, 1)

    idx = sequenceList.value.findIndex(item => item.id === song.id)
    if (idx === -1) return
    sequenceList.value.splice(idx, 1)
  }
  const clearPlayList = () => {
    playlist.value = []
    sequenceList.value = []
  }
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
    playHistory,
    searchHistory,
    currentTime,
    playlistPanelVisible,
    setSequenceList,
    setPlayList,
    addPlayList,
    setPlayMode,
    setPlayingState,
    setCurrentIndex,
    setFullScreen,
    setFavList,
    addPlayHistory,
    addSearchHistory,
    setCurrentTime,
    deleteSong,
    clearPlayList,
    setPlaylistPanelVisible,
    addSongToPlaylist,
  }
})
