<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
  // import createDetailComponent from '@/assets/js/create-detail-component'
  import { getSingerDetail } from '@/service/singer'
  import { processSongs } from '@/service/song'
  import MusicList from '@/components/music-list/music-list'
  import { SINGER_KEY } from '@/assets/js/constant'
  import storage from 'good-storage'

  // export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
  export default {
    name: 'singer-detail',
    props: {
      singer: Object,
    },
    data() {
      return {
        songs: [],
        loading: true,
      }
    },
    components: {
      MusicList,
    },
    computed: {
      title() {
        return this.computedSinger && this.computedSinger.name
      },
      pic() {
        return this.computedSinger && this.computedSinger.pic
      },
      computedSinger() {
        let ret = null
        const singer = this.singer
        if (singer) {
          ret = singer
        } else {
          const sessionSinger = storage.session.get(SINGER_KEY)
          if (sessionSinger && sessionSinger.mid === this.$route.params.id) {
            ret = sessionSinger
          }
        }
        return ret
      }
    },
    async created () {
      if (!this.computedSinger) {
        this.$router.push({
          path: this.$route.matched[0].path
        })
        return
      }
      // const result = await getSingerDetail(this.$route.params.id)
      const result = await getSingerDetail(this.computedSinger.mid)
      this.songs = await processSongs(result.songs)

      this.loading = false
    },
  }
</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
