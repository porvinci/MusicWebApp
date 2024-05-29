<template>
  <div
    class="user-center"
    v-no-result:[noResultText]="noResult"
  >
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="switches-wrapper">
      <switches
        :items="['我喜欢的', '最近播放']"
        v-model="currentIndex"
      ></switches>
    </div>
    <div
      class="play-btn"
      v-if="currentList.length"
      @click="playAll"
    >
      <i class="icon-play"></i>
      <span class="text">播放全部</span>
    </div>
    <div class="list-wrapper" :style="padBotStyle">
      <scroll class="list-scroll" v-if="currentIndex===0">
        <div class="list-inner">
          <song-list
            :songs="favoriteList"
            @select="selectSong"
          >
          </song-list>
        </div>
      </scroll>
      <scroll class="list-scroll" v-if="currentIndex===1">
        <div class="list-inner">
          <song-list
            :songs="playHistory"
            @select="selectSong"
          >
          </song-list>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
  import Switches from '@/components/base/switches/switches.vue'
  import SongList from '@/components/base/song-list/song-list.vue'
  import Scroll from '@/components/base/scroll/scroll.vue'
  import { useMusicPlayStore } from '@/store/musicPlay'

  export default {
    name: 'user-center',
    components: {
      Switches,
      SongList,
      Scroll,
    },
    data() {
      return {
        currentIndex: 0,
        musicPlayStore: useMusicPlayStore(),
        noResultText: '暂无歌曲',
        noResult: false,
      }
    },
    computed: {
      favoriteList() {
        return this.musicPlayStore.favList
      },
      playHistory() {
        return this.musicPlayStore.playHistory
      },
      currentList() {
        return !this.currentIndex ? this.favoriteList : this.playHistory
      },
      fullScreen() {
        return this.musicPlayStore.fullScreen
      },
      playlist() {
        return this.musicPlayStore.playlist
      },
      padBotStyle() {
        if (this.playlist.length > 0 && this.fullScreen === false) {
          return { 'padding-bottom': '60px' }
        } else return { 'padding-bottom': '0px' }
      },
    },
    methods: {
      back() {
        this.$router.back()
      },
      selectSong({ song, index }) {
        console.log('select 1111111111111111')
        this.musicPlayStore.addPlayList(song)
      },
      playAll() {
        console.log(',')
        if (this.currentIndex === 0) this.musicPlayStore.setPlayList(JSON.parse(JSON.stringify(this.favoriteList)))
        else this.musicPlayStore.setPlayList(JSON.parse(JSON.stringify(this.playHistory)))
        this.musicPlayStore.setCurrentIndex(0)
      }
    },
  }
</script>

<style scoped lang="scss">
  .user-center {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: $color-background;
    .back {
      position: absolute;
      top: 5px;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .switches-wrapper {
      margin: 10px 0 30px 0;
    }
    .play-btn {
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid $color-text-l;
      color: $color-text-l;
      border-radius: 100px;
      font-size: 0;
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
    .list-wrapper {
      position: absolute;
      top: 110px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
  }
</style>
