<template>
  <div
    class="player"
    v-show="playlist.length"
  >
    <transition
      name="normal"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
      @leave-after="onLeaveAfter"
    >
      <div
        class="normal-player"
        v-show="fullScreen"
      >
        <div class="background">
          <img :src="currentSong.pic">
        </div>
        <div class="top">
          <div
            class="back"
            @click="goBack"
          >
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend.prevent="onTouchEnd"
        >
          <div
            class="middle-l"
            :style="middleLStyle"
          >
            <div
              ref="cdWrapperRef"
              class="cd-wrapper"
            >
              <div
                class="cd"
              >
                <img
                  ref="cdImageRef"
                  class="image"
                  :src="currentSong.pic">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{singleLineLyric}}</div>
            </div>
          </div>
          <scroll
            class="middle-r"
            ref="lyricScrollRef"
            :style="middleRStyle"
          >
            <div class="lyric-wrapper">
              <div v-if="lyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{'current': lineSerialNum ===index}"
                  v-for="(line,index) in lyric.lines"
                  :key="line.num"
                >
                  {{line.txt}}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentView==='cd'}"></span>
            <span class="dot" :class="{'active':currentView==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)" :class="iconFavoriteStyle(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <mini-player
      :togglePlay="togglePlay"
    ></mini-player>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @ended="ended"
      @timeupdate="timeUpdate"
    ></audio>
  </div>
</template>

<script>
  import { useMusicPlayStore } from '@/store/musicPlay'
  import { computed, watch, ref, nextTick, provide } from 'vue'
  import useMode from './use-mode'
  import { PLAY_MODE } from '@/assets/js/constant'
  import useFavorite from './use-favorite'
  import useCd from './use-cd'
  import useLyric from './use-lyric'
  import useMiddleInteractive from './use-middle-interactive'
  import useAnimation from './use-animation'
  // import usePlayHistory from './use-play-history'
  import ProgressBar from './progress-bar'
  import Scroll from '@/components/base/scroll/scroll'
  import MiniPlayer from './mini-player'
  import { formatTime } from '@/assets/js/util'
  // import { PLAY_MODE } from '@/assets/js/constant'

  export default {
    name: 'player',
    components: {
      MiniPlayer,
      ProgressBar,
      Scroll
    },
    setup() {
      // data
      const audioRef = ref(null)
      const barRef = ref(null)
      const songReady = ref(false)
      const currentTime = ref(0)
      // let progressChanging = false

      // pinia
      const musicPlayStore = useMusicPlayStore()
      const playlist = computed(() => musicPlayStore.playlist)
      const playMode = computed(() => musicPlayStore.playMode)
      const playing = computed(() => musicPlayStore.playing)
      const currentIndex = computed(() => musicPlayStore.currentIndex)
      const fullScreen = computed(() => musicPlayStore.fullScreen)
      const currentSong = computed(() => musicPlayStore.currentSong)
      // hooks
      const { modeIcon, changeMode } = useMode()
      const { iconFavoriteStyle, toggleFavorite } = useFavorite()
      const { cdImageRef } = useCd()
      const { lyric, lineSerialNum, lyricScrollRef, lyricListRef, pureMusicLyric, singleLineLyric } = useLyric()
      const { currentView, onTouchStart, onTouchMove, onTouchEnd, middleLStyle, middleRStyle } = useMiddleInteractive()
      const { cdWrapperRef, onEnter, onAfterEnter, onLeave, onAfterLeave } = useAnimation()
      // const { savePlay } = usePlayHistory()

      // computed
      const playIcon = computed(() => {
        return playing.value ? 'icon-pause' : 'icon-play'
      })

      const progress = computed(() => {
        return currentTime.value / currentSong.value.duration
      })

      // 隔代父传孙
      provide('progress', progress)

      const disableCls = computed(() => {
        return songReady.value ? '' : 'disable'
      })

      // watch
      watch(currentSong, async (newSong) => {
        // console.log('curr', currentSong, 'new', newSong, 'url', newSong.url)
        if (!newSong.id || !newSong.url) {
          return
        }
        // currentTime.value = 0
        songReady.value = false
        await nextTick()
        const audioEl = audioRef.value
        audioEl.src = newSong.url
        musicPlayStore.setPlayingState(true)
      })

      watch(songReady, async (newV) => {
        await nextTick()
        const audioEl = audioRef.value
        if (newV) {
          audioEl.play()
        }
      })

      watch(currentTime, (newV) => {
        musicPlayStore.setCurrentTime(newV)
      })

      watch(fullScreen, async (newV) => {
        await nextTick()
        barRef.value.setOffset(progress)
      })

      watch(playing, newV => {
        const taregtEI = audioRef.value
        if (newV) taregtEI.play()
        else taregtEI.pause()
      })

      watch(() => playlist.value, newV => {
        // console.log('111')
        if (!newV || newV.length === 0) {
          // console.log('222')
          musicPlayStore.setPlayingState(false)
        }
      }, { deep: true })
      // methods
      function goBack() {
        musicPlayStore.setFullScreen(false)
      }

      function togglePlay() {
        const state = playing.value
        musicPlayStore.setPlayingState(!state)
        // const taregtEI = audioRef.value
        // if (state) taregtEI.pause()
        // else taregtEI.play()
      }

      function pause() {
        musicPlayStore.setPlayingState(false)
      }

      function prev() {
        const value = currentIndex.value
        const len = playlist.value.length
        if (!len) return
        const index = value === 0 ? len - 1 : value - 1
        musicPlayStore.setCurrentIndex(index)
      }

      function next() {
        const value = currentIndex.value
        const len = playlist.value.length
        if (!len) return
        const index = value === len - 1 ? 0 : value + 1
        musicPlayStore.setCurrentIndex(index)
      }

      function ready() {
        if (songReady.value) return
        songReady.value = true
      }

      function error() {
        songReady.value = true
      }

      function ended() {
        if (playMode.value !== PLAY_MODE.loop) next()
        else togglePlay()
      }

      function timeUpdate(e) {
        currentTime.value = e.target.currentTime
      }

      function onProgressChanging(progress) {
        audioRef.value.currentTime = currentTime.value = progress * currentSong.value.duration
      }

      function onProgressChanged(progress) {
        audioRef.value.currentTime = currentTime.value = progress * currentSong.value.duration
      }

      return {
        audioRef,
        barRef,
        fullScreen,
        currentTime,
        currentSong,
        playlist,
        playIcon,
        disableCls,
        progress,
        goBack,
        togglePlay,
        pause,
        prev,
        next,
        ready,
        error,
        ended,
        timeUpdate,
        formatTime,
        onProgressChanging,
        onProgressChanged,
        // end,
        // mode
        modeIcon,
        changeMode,
        // favorite
        iconFavoriteStyle,
        toggleFavorite,
        // cd
        cdImageRef,
        // lyric
        lyric,
        lineSerialNum,
        pureMusicLyric,
        singleLineLyric,
        lyricScrollRef,
        lyricListRef,
        // middle-interactive
        currentView,
        middleLStyle,
        middleRStyle,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        // animation
        cdWrapperRef,
        onEnter,
        onAfterEnter,
        onLeave,
        onAfterLeave
      }
    }
  }
</script>

<style lang="scss" scoped>
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);

        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
        }
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .image {
                animation: rotate 20s linear infinite
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
           width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
           .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
    }
    .normal-enter-from, .normal-leave-to{
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
    .normal-enter-active, .normal-leave-active{
      transition: all .6s;
      .top, .bottom {
        transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
  }
</style>
