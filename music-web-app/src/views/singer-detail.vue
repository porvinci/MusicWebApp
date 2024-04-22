<template>
  <div class="singer-detail">
    <!-- <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list> -->
  </div>
</template>

<script>
  // import createDetailComponent from '@/assets/js/create-detail-component'
  import { getSingerDetail } from '@/service/singer'
  import { processSongs } from '@/service/song'
  // import { SINGER_KEY } from '@/assets/js/constant'

  // export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
  export default {
    name: 'singer-detail',
    props: {
      singer: Object,
    },
    async created () {
      // const result = await getSingerDetail(this.$route.params.id)
      const result = await getSingerDetail(this.singer.mid)
      const songs = await processSongs(result.songs)
      console.log(songs)
      // console.log(this.$route.params.id)
    }
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
