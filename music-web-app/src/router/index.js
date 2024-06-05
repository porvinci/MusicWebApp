import { createRouter, createWebHashHistory } from 'vue-router'
// import Recommend from '@/views/recommend.vue'
// import Singer from '@/views/singer.vue'
// import TopList from '@/views/top-list.vue'
// import Search from '@/views/search.vue'
// import SingerDetail from '@/views/singer-detail.vue'
// import Album from '@/views/album.vue'
// import TopDetail from '@/views/top-detail.vue'
// import UserCenter from '@/views/user-center.vue'
const Recommend = () => import('@/views/recommend.vue'/* webpackChunkName: "recommend" */)
const Singer = () => import('@/views/singer.vue')
const TopList = () => import('@/views/top-list.vue')
const Search = () => import('@/views/search.vue')
const SingerDetail = () => import('@/views/singer-detail.vue')
const Album = () => import('@/views/album.vue')
const TopDetail = () => import('@/views/top-detail.vue')
const UserCenter = () => import('@/views/user-center.vue')
const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album,
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [{
      path: ':id',
      component: SingerDetail,
    }]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail,
      }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail,
      }
    ]
  },
  {
    path: '/user',
    components: {
      user: UserCenter,
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
