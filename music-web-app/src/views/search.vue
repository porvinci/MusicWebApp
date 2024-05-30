<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll
      ref="scrollRef"
      class="search-content"
      v-show="!query"
    >
      <div class="search-content">
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{item.key}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            cancelBtnText="取消"
            @confirm="clearSearch"
          >
          </confirm>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      ></suggest>
    </div>
    <router-view v-slot='{ Component }'>
      <transition name="slide">
        <component :is="Component" :singer="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
  import { ref, watch, nextTick, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import storage from 'good-storage'
  import { getHotKeys } from '@/service/search.js'
  import { SINGER_KEY, HISTORY_KEY } from '@/assets/js/constant'
  import SearchInput from '@/components/search/search-input.vue'
  import Suggest from '@/components/search/suggest.vue'
  import Scroll from '@/components/base/scroll/scroll.vue'
  import SearchList from '@/components/base/search-list/search-list.vue'
  import Confirm from '@/components/base/confirm/confirm.vue'
  import { useMusicPlayStore } from '@/store/musicPlay'

  export default {
    name: 'search',
    components: {
      SearchInput,
      Suggest,
      Scroll,
      SearchList,
      Confirm,
    },
    setup() {
      const router = useRouter()
      const query = ref('')
      const hotKeys = ref([])
      const selectedSinger = ref(null)
      const scrollRef = ref(null)
      const confirmRef = ref(null)
      const musicPlayStore = useMusicPlayStore()
      const searchHistory = computed(() => musicPlayStore.searchHistory)

      watch(query, async val => {
        val = val.trim()
        if (val) musicPlayStore.addSearchHistory(val)
        await nextTick()
        scrollRef.value.scroll.scroll.value.refresh()
      })

      getHotKeys().then(res => { hotKeys.value = res.hotKeys })

      function addQuery(item) {
        query.value = item
      }

      function selectSong(song) {
        musicPlayStore.addSongToPlaylist(song)
        musicPlayStore.setFullScreen(true)
      }

      function selectSinger(singer) {
        selectedSinger.value = singer
        storage.session.set(SINGER_KEY, singer)
        router.push({
          path: `/search/${singer.mid}`
        })
      }

      function deleteSearch(historyRecord) {
        const idx = searchHistory.value.findIndex(item => item === historyRecord)
        if (idx === -1) return
        searchHistory.value.splice(idx, 1)
        storage.session.set(HISTORY_KEY, searchHistory.value)
      }

      function showConfirm() {
        confirmRef.value.show()
      }

      function clearSearch() {
        searchHistory.value = []
        storage.session.remove(HISTORY_KEY)
      }

      return {
        scrollRef,
        query,
        hotKeys,
        selectedSinger,
        confirmRef,
        addQuery,
        selectSong,
        selectSinger,
        searchHistory,
        deleteSearch,
        showConfirm,
        clearSearch,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      margin: 20px;
    }
    .search-content {
      flex: 1;
      overflow: hidden;
      .hot-keys {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
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
    }
    .search-result {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
