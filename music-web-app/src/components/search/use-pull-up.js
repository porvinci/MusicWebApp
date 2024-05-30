import { onMounted, ref, watchEffect, onUnmounted, nextTick } from 'vue'
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
import { searchQuery } from '@/service/search.js'
import { processSongs } from '@/service/song'

BScroll.use(Pullup)

export default function usePullUp(wrapperRef, props) {
  const singer = ref(null)
  const songs = ref([])
  const suggestBS = ref(null)
  const pullUpLoading = ref(false)
  const loading = ref(true)
  const noResult = ref(false)
  const ulRef = ref(null)
  let songsVal = []
  let suggestBSVal = null
  let page = 1
  let showSinger = true
  let hasMore = false
  let fixedHeight = null
  let ulHeight = null

  watchEffect(async () => {
    page = 1
    showSinger = true
    songsVal = []
    hasMore = false
    loading.value = true
    noResult.value = false
    const res = await searchQuery(props.query, page, showSinger)
    singer.value = res.singer
    songsVal = await processSongs(res.songs)
    songs.value = songsVal
    hasMore = res.hasMore
    loading.value = false
    noResult.value = false
    if (!res.singer && !res.songs.length) {
      noResult.value = true
      return
    }
    if (props.query) {
      await nextTick()
      suggestBSVal.refresh()
      fixedHeight = wrapperRef.value.clientHeight
      ulHeight = ulRef.value.clientHeight
      while (ulHeight < fixedHeight && hasMore) {
        await handler()
        ulHeight = ulRef.value.clientHeight
        fixedHeight = wrapperRef.value.clientHeight
      }
    }
  })

  onMounted(() => {
    suggestBSVal = suggestBS.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      scrollY: true,
      pullUpLoad: true,
    })
    suggestBSVal.on('pullingUp', handler)
  })

  async function handler() {
    if (!hasMore) return
    ulHeight = ulRef.value.clientHeight
    fixedHeight = wrapperRef.value.clientHeight
    if (ulHeight >= fixedHeight) pullUpLoading.value = true
    await searchQuery(props.query, ++page, showSinger).then(async res => {
      singer.value = res.singer
      const tmp = await processSongs(res.songs)
      songsVal = songsVal.concat(tmp)
      songs.value = songsVal
      hasMore = res.hasMore
    })
    suggestBSVal.finishPullUp()
    await nextTick()
    suggestBSVal.refresh()
    pullUpLoading.value = false
  }

  onUnmounted(() => {
    suggestBS.value.destroy()
  })

  return {
    singer,
    songs,
    suggestBS,
    pullUpLoading,
    loading,
    noResult,
    ulRef,
  }
}
