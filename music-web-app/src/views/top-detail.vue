<template>
  <div class="top-detail" :style="{'padding-bottom': padBotVal}">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
      :rank="true"
    ></music-list>
  </div>
</template>

<script>
  import { computed } from 'vue'
  import { useMusicPlayStore } from '@/store/musicPlay'
  import { getTopListDetail } from '@/service/top-list'
  import { processSongs } from '@/service/song'
  import MusicList from '@/components/music-list/music-list'
  import { TOPLIST_KEY } from '@/assets/js/constant'
  import storage from 'good-storage'

  export default {
    name: 'top-detail',
    props: {
      topItem: Object,
    },
    data() {
      return {
        songs: [],
        loading: true,
        topItemFromStorage: {},
      }
    },
    components: {
      MusicList,
    },
    computed: {
      title() {
        return this.topItemFromStorage?.name
      },
      pic() {
        return this.topItemFromStorage?.pic
      },
    },
    async created () {
      if (this.topItem) {
        // 如果是通过一级路由传过来的，那么就保存到localstorage中
        const val = storage.get(TOPLIST_KEY, {})
        // topItem.id作为键去查找，这个也就是路由中的一部分
        const id = this.topItem.id
        if (!val[id]) {
          val[id] = this.topItem
          storage.set(TOPLIST_KEY, val)
        }
      }
      this.topItemFromStorage = storage.get(TOPLIST_KEY, {})[this.$route.params.id]
      if (this.topItemFromStorage === undefined) {
        // 如果这个id是用户随便输入的，localstorege中没有那么就返回上一级
        this.$router.push({ path: `${this.$route.matched[0].path}` })
        return
      }
      const result = await getTopListDetail(this.topItemFromStorage)
      this.songs = await processSongs(result.songs)
      this.loading = false
    },
    setup() {
      const musicPlayStore = useMusicPlayStore()
      const fullScreen = computed(() => musicPlayStore.fullScreen)
      const playlist = computed(() => musicPlayStore.playlist)

      const padBotVal = computed(() => {
        return (fullScreen.value === false) && (playlist.value.length > 0) ? '60px' : '0px'
      })

      return {
        padBotVal
      }
    }
  }
</script>

<style lang="scss" scoped>
  .top-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
