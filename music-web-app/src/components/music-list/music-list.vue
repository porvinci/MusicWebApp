<template>
  <div class="music-list">
    <div
      class="back"
      @click="goBack"
    >
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div
      class="bg-image"
      :style="bgImageStyle"
      ref="bgImage"
    >
      <div
        class="play-btn-wrapper"
        :style="playBtnStyle"
      >
        <div
          v-show="songs.length > 0"
          class="play-btn"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div
        class="filter"
        :style="filterStyle"
      ></div>
    </div>
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list
          :songs="songs"
          @select="selectSong"
          :rank="rank"
        ></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
  import SongList from '@/components/base/song-list/song-list'
  import Scroll from '@/components/base/scroll/scroll'
  import { useMusicPlayStore } from '@/store/musicPlay'
  import { shuffle } from '@/assets/js/util'
  import { PLAY_MODE } from '@/assets/js/constant'
  // import useMusicList from './useMusicList'
  // import Scroll from '@/components/wrap-scroll'
  // import { mapActions, mapState } from 'vuex'

  const RESERVED_HEIGHT = 40

  export default {
    name: 'music-list',
    components: {
      SongList,
      Scroll
    },
    props: {
      songs: {
        type: Array,
        default() {
          return []
        }
      },
      title: String,
      pic: String,
      loading: Boolean,
      noResultText: {
        type: String,
        default: '抱歉，无可播放歌曲'
      },
      rank: Boolean
    },
    data() {
      return {
        imageHeight: 0,
        scrollY: 0,
        maxTranslateY: 0,
      }
    },
    computed: {
      noResult() {
        return !this.loading && !this.songs.length
      },
      bgImageStyle() {
        let height = 0
        let paddingTop = '70%'
        let zIndex = 0
        let translateZ = 0
        if (this.scrollY > this.maxTranslateY) {
          height = `${RESERVED_HEIGHT}px`
          paddingTop = 0
          zIndex = 10
          translateZ = 1
        }
        let scale = 1
        if (this.scrollY < 0) {
          scale = 1 + Math.abs(this.scrollY / this.imageHeight)
        }
        return {
          height,
          paddingTop,
          zIndex,
          backgroundImage: `url(${this.pic})`,
          transform: `scale(${scale})translateZ(${translateZ}px`
          // transform: `scale(${scale}))`
        }
      },
      scrollStyle() {
        return {
          top: `${this.imageHeight}px`,
        }
      },
      filterStyle() {
        let blur = 1
        const scrollY = this.scrollY
        const imageHeight = this.imageHeight
        if (scrollY >= 0) {
          blur = Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 25
        }
        return {
          backdropFilter: `blur(${blur}px)`
        }
      },
      playBtnStyle() {
        let display = ''
        if (this.scrollY >= this.maxTranslateY) {
          display = 'none'
        }
        return {
          display
        }
      },
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      onScroll(pos) {
        this.scrollY = -pos.y
      },
      selectSong({ song, index }) {
        const musicPlayStore = useMusicPlayStore()
        if (!musicPlayStore.playlist.length) {
          // 第一次唤醒播放器
          musicPlayStore.setPlayList(this.songs)
          musicPlayStore.setSequenceList(this.songs)
          musicPlayStore.setCurrentIndex(index)
        } else {
          // 添加歌曲
          musicPlayStore.addPlayList(song)
        }
        musicPlayStore.setFullScreen(true)
      },
      random() {
        const musicPlayStore = useMusicPlayStore()
        const arr = shuffle(JSON.parse(JSON.stringify(this.songs)))
        musicPlayStore.setPlayList(arr)
        musicPlayStore.setSequenceList(this.songs)
        musicPlayStore.setCurrentIndex(0)
        musicPlayStore.setPlayMode(PLAY_MODE.random)
      }
    },
  }
</script>

<style lang="scss" scoped>
  .music-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      // padding-top: 70%;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;
      // overflow: hidden;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>
