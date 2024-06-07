// const { defineConfig } = require('@vue/cli-service')
const registerRouter = require('./backend/router')
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `,
      },
    },
  },
  pwa: {
    name: "musicpwa",
    themeColor: "#ffcd32",
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      // mode: 'development', // 开发模式
      runtimeCaching: [
        {
          urlPattern: new RegExp('https:\/\/musicpwa\.vercel\.app\/apii\/getRecommend'),
          handler: "NetworkFirst",
          options: {
            cacheName: 'Recommend',
            expiration: {
              maxAgeSeconds: 3 * 24 * 60 * 60
            },
          }
        },
        {
          urlPattern: new RegExp('https:\/\/musicpwa\.vercel\.app\/apii\/getHotKeys'),
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: 'HotKeys',
            expiration: {
              maxAgeSeconds: 3 * 24 * 60 * 60
            },
          }
        },
        {
          urlPattern: new RegExp('https:\/\/musicpwa\.vercel\.app\/apii\/getSingerList'),
          handler: "CacheFirst",
          options: {
            cacheName: 'SingerList',
            expiration: {
              maxAgeSeconds: 7 * 24 * 60 * 60
            },
          }
        },
        {
          urlPattern: new RegExp('https:\/\/musicpwa\.vercel\.app\/apii\/getTopList'),
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: 'TopList',
            expiration: {
              maxAgeSeconds: 7 * 24 * 60 * 60
            },
          }
        },
        {
          urlPattern: new RegExp('https:\/\/musicpwa\.vercel\.app\/apii\/getAlbum.*'),
          handler: "CacheFirst",
          options: {
            cacheName: 'Album',
            expiration: {
              maxAgeSeconds: 14 * 24 * 60 * 60,
            },
          }
        },
        {
          urlPattern: new RegExp('https:\/\/musicpwa\.vercel\.app\/apii\/search.*'),
          handler: "CacheFirst",
          options: {
            cacheName: 'Search',
            expiration: {
              maxEntries: 8
            },
          }
        },
        {
          urlPattern: new RegExp('https:\/\/musicpwa\.vercel\.app\/apii\/getSingerDetail.*'),
          handler: "CacheFirst",
          options: {
            cacheName: 'SingerDetail',
            expiration: {
              maxAgeSeconds: 30 * 24 * 60 * 60,
            },
          }
        },
        {
          urlPattern: new RegExp('https:\/\/musicpwa\.vercel\.app\/apii\/getTopDetail.*'),
          handler: "CacheFirst",
          options: {
            cacheName: 'TopDetail',
            expiration: {
              maxAgeSeconds: 7 * 24 * 60 * 60,
            },
          }
        },
        {
          urlPattern: new RegExp('https:\/\/musicpwa\.vercel\.app\/apii\/getSongsUrl.*'),
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: 'SongsUrl',
            expiration: {
              maxAgeSeconds: 24 * 60 * 60,
            },
          }
        },
        {
          urlPattern: new RegExp('https:\/\/musicpwa\.vercel\.app\/apii\/getLyric.*'),
          handler: "CacheFirst",
          options: {
            cacheName: 'Lyric',
            expiration: {
              maxAgeSeconds: 30 * 24 * 60 * 60,
            },
          }
        }
      ]
    },
  },
  devServer: {
    setupMiddlewares(middlewares, devServer) {
      registerRouter(devServer)
      return middlewares
    },
  },
  configureWebpack: (config) => {
    if (process.env.npm_config_report) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  },
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
}
