<template>
  <transition name="mini">
    <div
      class="mini-player"
      v-show="!fullScreen"
      @click="swiftToFullScreen"
    >
      <div class="cd-wrapper">
        <div
          class="cd"
        >
          <img
            ref="cdImageRef"
            width="40"
            height="40"
            :src="currentSong.pic"
          >
        </div>
      </div>
      <div
        class="slider-wrapper"
      >
        <div class="slider-group">
          <div
            class="slider-page"
          >
            <h2 class="name">{{currentSong.name}}</h2>
            <p class="desc">{{currentSong.singer}}</p>
          </div>
        </div>
      </div>
      <!-- <div class="control">
        <progress-circle
          :radius="32"
          :progress="progress"
        >
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </progress-circle>
      </div> -->
      <!-- <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
      <playlist ref="playlistRef"></playlist> -->
    </div>
  </transition>
</template>

<script>
  import { computed } from 'vue'
  import { useMusicPlayStore } from '@/store/musicPlay'
  import useCd from './use-cd'

  export default {
    name: 'mini-player',
    setup() {
     const musicPlayStore = useMusicPlayStore()
     const fullScreen = computed(() => musicPlayStore.fullScreen)
     const currentSong = computed(() => musicPlayStore.currentSong)

     const { cdImageRef } = useCd()

     function swiftToFullScreen() {
      musicPlayStore.setFullScreen(true)
     }

     return {
      fullScreen,
      currentSong,
      swiftToFullScreen,
      cdImageRef,
     }
    }
  }
</script>

<style lang="scss" scoped>
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    .cd-wrapper {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;
      .cd {
        height: 100%;
        width: 100%;
        img {
          border-radius: 50%;
          animation: rotate 20s linear infinite;
        }
      }
    }
    .slider-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        .slider-page {
          display: inline-block;
          width: 100%;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          .name {
            margin-bottom: 2px;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text;
          }
          .desc {
            @include no-wrap();
            font-size: $font-size-small;
            color: $color-text-d;
          }
        }
      }
    }
    // .control {
    //   flex: 0 0 30px;
    //   width: 30px;
    //   padding: 0 10px;
    //   .icon-playlist {
    //     position: relative;
    //     top: -2px;
    //     font-size: 28px;
    //     color: $color-theme-d;
    //   }
    //   .icon-mini {
    //     position: absolute;
    //     left: 0;
    //     top: 0;
    //     color: $color-theme-d;
    //     font-size: 32px;
    //   }
    // }
    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
    }
    &.mini-enter-from, &.mini-leave-to {
      opacity: 0;
      transform: translate3d(0, 100%, 0)
    }
  }
</style>
