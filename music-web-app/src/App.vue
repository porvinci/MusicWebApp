<template>
  <m-header></m-header>
  <tab></tab>
  <router-view :style="padBotStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>
  <router-view v-slot="{ Component }" name="user" :style="padBotStyle">
    <transition name="slide">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </transition>
  </router-view>
  <player></player>
</template>

<script>
  import Header from '@/components/header/header'
  import Tab from '@/components/tab/tab'
  import Player from '@/components/player/player'
  import { useMusicPlayStore } from '@/store/musicPlay'

  export default {
    components: {
      MHeader: Header,
      Tab,
      Player
    },
    computed: {
      playlist() {
        const musicPlayStore = useMusicPlayStore()
        return musicPlayStore.playlist
      },
      fullScreen() {
        const musicPlayStore = useMusicPlayStore()
        return musicPlayStore.fullScreen
      },
      padBotStyle() {
        if (this.playlist.length > 0 && this.fullScreen === false) {
          return { 'padding-bottom': '60px' }
        } else return { 'padding-bottom': '0px' }
      }
    }
  }
</script>
