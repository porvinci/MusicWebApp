<template>
  <div
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
    ref="suggestRef"
  >
    <ul class="suggest-list" ref="ulRef">
      <li
        class="suggest-item"
        v-if="singer"
        @click="selectSinger(singer)"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{song.singer}}-{{song.name}}
          </p>
        </div>
      </li>
      <div
        class="suggest-item"
        v-loading:[loadingText]="pullUpLoading"
      ></div>
    </ul>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import usePullUp from './use-pull-up.js'

  export default {
    name: 'suggest',
    props: {
      query: {
        type: String,
        default: '',
      },
    },
    emits: ['select-song', 'select-singer'],
    setup(props, { emit }) {
      const suggestRef = ref(null)
      const loadingText = ref('')
      const noResultText = ref('抱歉，找不到您想要的结果')

      const { singer, songs, suggestBS, pullUpLoading, loading, noResult, ulRef } = usePullUp(suggestRef, props)

      function selectSong(song) {
        // console.log('song', song)
        emit('select-song', song)
      }

      function selectSinger(singer) {
        emit('select-singer', singer)
      }

      return {
        singer,
        songs,
        loading,
        loadingText,
        noResult,
        noResultText,
        suggestRef,
        suggestBS,
        pullUpLoading,
        ulRef,
        selectSong,
        selectSinger,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include no-wrap();
          }
        }
      }
    }
  }
</style>
