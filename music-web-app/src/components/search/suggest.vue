<template>
  <div
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer"
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
      <!-- <div
        class="suggest-item"
        v-loading:[loadingText]="pullUpLoading"
      ></div> -->
    </ul>
  </div>
</template>

<script>
  import { ref, watchEffect } from 'vue'
  import { searchQuery } from '@/service/search.js'
  import { processSongs } from '@/service/song'

  export default {
    name: 'suggest',
    props: {
      query: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const singer = ref(null)
      const songs = ref([])
      const loading = ref(true)
      const loadingText = ref('')
      const noResult = ref(false)
      const noResultText = ref('抱歉，找不到您想要的结果')

      watchEffect(() => {
        searchQuery(props.query, 0, true).then(async res => {
          console.log(res)
          singer.value = res.singer
          songs.value = await processSongs(res.songs)
          loading.value = false
          noResult.value = false
          if (!res.singer && !res.songs.length) {
            noResult.value = true
          }
        })
      })

      return {
        singer,
        songs,
        loading,
        loadingText,
        noResult,
        noResultText,
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
