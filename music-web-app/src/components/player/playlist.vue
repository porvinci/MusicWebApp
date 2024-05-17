<template>
  <teleport to="body">
    <transition name="list-fade">
      <div
        class="playlist"
        v-show="visible && playlist.length"
      >
        <div class="list-wrapper">
          <div class="list-header">
            <h1 class="title">
              <i
                class="icon"
                :class="modeIcon"
                @click.stop="changeMode"
              >
              </i>
              <span class="text">{{modeText}}</span>
              <!-- <span class="clear">
                <i class="icon-clear"></i>
              </span> -->
            </h1>
          </div>
          <scroll
            class="list-content"
            ref="scrollListRef"
          >
            <ul
              ref="ulListRef"
              name="list"
            >
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectSong(song)"
              >
                <i
                  class="current"
                  :class="getCurrentIcon(song)"
                ></i>
                <span class="text">{{song.name}}</span>
                <span class="favorite">
                  <i :class="iconFavoriteStyle(song)"></i>
                </span>
                <!-- <span
                  class="delete"
                >
                  <i class="icon-delete"></i>
                </span> -->
              </li>
            </ul>
          </scroll>
          <div class="list-footer" @click.stop="hidden">
            <span>关闭</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
  import { useMusicPlayStore } from '@/store/musicPlay'
  import { computed, ref, watch, nextTick } from 'vue'
  import Scroll from '@/components/base/scroll/scroll.vue'
  import useMode from './use-mode'
  import useFavorite from './use-favorite'

  export default {
    name: 'playlist',
    components: {
      Scroll,
    },
    setup() {
      const visible = ref(false)
      const ulListRef = ref(null)
      const scrollListRef = ref(null)
      const musicPlayStore = useMusicPlayStore()
      const currentSong = computed(() => musicPlayStore.currentSong)
      const playlist = computed(() => musicPlayStore.playlist)
      const sequenceList = computed(() => musicPlayStore.sequenceList)
      const { modeIcon, changeMode, modeText } = useMode()
      const { iconFavoriteStyle, toggleFavorite } = useFavorite()

      watch(currentSong, async newV => {
        console.log('3')
        if (!visible.value) return
        scrollToTargetEI(currentSong)
      })

      watch(visible, async newV => {
        if (newV) {
          await nextTick()
          refresh()
          console.log('4')
          scrollToTargetEI(currentSong)
        }
      })

      async function scrollToTargetEI(song) {
        console.log('song', song)
        const index = sequenceList.value.findIndex(item => item.id === song.value.id)
        console.log('index', index)
        await nextTick()
        const targetEI = ulListRef.value.children[index]
        scrollListRef.value.scroll.scroll.value.scrollToElement(targetEI, 0)
      }

      function show() {
        console.log('2')
        visible.value = true
      }

      function hidden() {
        visible.value = false
      }

      function refresh() {
        console.log('fresh')
        scrollListRef.value.scroll.scroll.value.refresh()
      }

      function getCurrentIcon(song) {
        return currentSong.value.id === song.id ? 'icon-pause' : ''
      }

      function selectSong(song) {
        const index = sequenceList.value.findIndex(item => item.id === song.id)
        musicPlayStore.setCurrentIndex(index)
      }

      return {
        visible,
        playlist,
        sequenceList,
        show,
        hidden,
        getCurrentIcon,
        selectSong,
        // mode
        modeIcon,
        changeMode,
        modeText,
        // favorite
        iconFavoriteStyle,
        toggleFavorite,
        // scroll
        scrollListRef,
        ulListRef,
      }
    }
  }

</script>

<style lang="scss" scoped>
  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-wrapper {
        transition: all .3s;
      }
    }
    &.list-fade-enter-from, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 210;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 24px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .favorite {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
          }
        }
      }
      .list-add {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-footer {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
