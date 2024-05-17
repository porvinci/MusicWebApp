import { useMusicPlayStore } from '@/store/musicPlay'
import { computed } from 'vue'
import storage from 'good-storage'
import { SONG_KEY } from '@/assets/js/constant'

export default function useFavorite() {
  const musicPlayStore = useMusicPlayStore()
  // const curSong = computed(() => musicPlayStore.currentSong)
  const favList = computed(() => musicPlayStore.favList)
  function iconFavoriteStyle(song) {
    return favList.value.some(item => item.id === song.id) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function toggleFavorite(song) {
    const stoList = storage.get(SONG_KEY, [])
    let idx = -1
    stoList.forEach((item, index) => {
      if (item.id === song.id) idx = index
    })
    // 如果有则需要取消收藏; 如果没有则需要添加进列表stoList并存储到本地中
    if (idx !== -1) stoList.splice(idx, 1)
    else stoList.push(song)
    musicPlayStore.setFavList(stoList)
    storage.set(SONG_KEY, stoList)
  }

  return {
    iconFavoriteStyle,
    toggleFavorite,
  }
}
