<template>
  <div
    class="singer"
    v-loading="!singers.length"
  >
  <!-- :style="{'padding-bottom': padBotVal}" -->
    <index-list
      :data="singers"
      @select="selectSinger"
    ></index-list>
    <router-view v-slot="{ Component }" >
      <transition name="slide">
        <!-- :singer="selectedSinger"要放在component这个路由改变时的新组件上 -->
        <component :is="Component" :singer="selectedSinger"/>
      </transition>
    </router-view>
    <!-- <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view> -->
    <!-- <router-view :singer="selectedSinger"></router-view> -->
  </div>
</template>

<script>
  // import { computed } from 'vue'
  import { getSingerList } from '@/service/singer'
  import IndexList from '@/components/index-list/index-list'
  import storage from 'good-storage'
  import { SINGER_KEY } from '@/assets/js/constant'
  // import { useMusicPlayStore } from '@/store/musicPlay'

  export default {
    name: 'singer',
    components: {
      IndexList
    },
    data() {
      return {
        singers: [],
        selectedSinger: null
      }
    },
    async created() {
      const result = await getSingerList()
      this.singers = result.singers
    },
    methods: {
      selectSinger(singer) {
        this.selectedSinger = singer
        storage.session.set(SINGER_KEY, singer)
        this.$router.push({
          path: `/singer/${singer.mid}`
        })
      },
    },
    // setup() {
    //   const musicPlayStore = useMusicPlayStore()
    //   const fullScreen = computed(() => musicPlayStore.fullScreen)
    //   const playlist = computed(() => musicPlayStore.playlist)

    //   const padBotVal = computed(() => {
    //     return (fullScreen.value === false) && (playlist.value.length > 0) ? '60px' : '0px'
    //   })

    //   return {
    //     padBotVal
    //   }
    // }
  }
</script>

<style lang="scss" scoped>
  .singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>
