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
              <span class="clear" @click.stop="popConfirmBox">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <scroll
            class="list-content"
            ref="scrollListRef"
          >
            <transition-group
              ref="ulListRef"
              name="list"
              tag="ul"
            >
              <li
                class="item"
                v-for="song in playlist"
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
                <span
                  class="delete"
                  @click.stop="deleteSong(song)"
                  :class="{'disable': !deleting}"
                >
                  <i
                    class="icon-delete"
                  ></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-footer" @click.stop="hidden">
            <span>关闭</span>
          </div>
          <confirm
            ref="confirmRef"
            text="是否清空播放列表？"
            confirmBtnText="清空"
            cancelBtnText="取消"
            @confirm="close"
          ></confirm>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
  import { useMusicPlayStore } from '@/store/musicPlay'
  import { computed, ref, watch, nextTick } from 'vue'
  import Scroll from '@/components/base/scroll/scroll.vue'
  import Confirm from '@/components/base/confirm/confirm'
  import useMode from './use-mode'
  import useFavorite from './use-favorite'

  export default {
    name: 'playlist',
    components: {
      Scroll,
      Confirm,
    },
    setup() {
      const deleting = ref(false)
      const visible = ref(false)
      const ulListRef = ref(null)
      const scrollListRef = ref(null)
      const confirmRef = ref(null)
      const musicPlayStore = useMusicPlayStore()
      const currentIndex = computed(() => musicPlayStore.currentIndex)
      const currentSong = computed(() => musicPlayStore.currentSong)
      const playlist = computed(() => musicPlayStore.playlist)
      const sequenceList = computed(() => musicPlayStore.sequenceList)
      const { modeIcon, changeMode, modeText } = useMode()
      const { iconFavoriteStyle, toggleFavorite } = useFavorite()

      watch(currentSong, async newV => {
        if (!visible.value || !newV.id) return
        scrollToTargetEI(currentSong)
      })

      watch(visible, async newV => {
        if (newV) {
          await nextTick()
          refresh()
          scrollToTargetEI(currentSong)
        }
      })

      watch(() => playlist.value, newV => {
        if (!playlist.value.length) visible.value = false
      }, { deep: true })

      async function scrollToTargetEI(song) {
        const index = playlist.value.findIndex(item => item.id === song.value.id)
        if (index === -1) return
        await nextTick()
        const targetEI = ulListRef.value.$el.children[index]
        scrollListRef.value.scroll.scroll.value.scrollToElement(targetEI, 0)
      }

      function show() {
        visible.value = true
      }

      function hidden() {
        visible.value = false
      }

      function refresh() {
        scrollListRef.value.scroll.scroll.value.refresh()
      }

      function getCurrentIcon(song) {
        return currentSong.value.id === song.id ? 'icon-pause' : ''
      }

      function selectSong(song) {
        const index = playlist.value.findIndex(item => item.id === song.id)
        musicPlayStore.setCurrentIndex(index)
      }

      function deleteSong(song) {
        if (deleting.value) return
        deleting.value = true
        const idx = playlist.value.findIndex(item => item.id === song.id)
        if (idx === -1) return
        if (idx < currentIndex.value || idx === playlist.value.length - 1) {
          console.log('末端', idx === playlist.value.length - 1)
          musicPlayStore.setCurrentIndex(currentIndex.value - 1)
        }
        musicPlayStore.deleteSong(song)
        setTimeout(() => { deleting.value = false }, 300)
        // refresh()
      }

      function popConfirmBox() {
        console.log('1')
        confirmRef.value.show()
      }

      function close() {
        console.log('close')
        visible.value = false
      }

      return {
        visible,
        playlist,
        sequenceList,
        show,
        hidden,
        getCurrentIcon,
        selectSong,
        deleteSong,
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
        // confirm
        confirmRef,
        popConfirmBox,
        close,
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
