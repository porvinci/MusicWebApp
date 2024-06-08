const registerRouter = require('./backend/router')
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin')
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
    // workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      // swSrc: './src/service-worker.js',
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.url.startsWith('https://isure.stream.qqmusic.qq.com'),
          handler: "CacheFirst",
          options: {
            cacheName: 'Audios',
            expiration: {
              maxAgeSeconds: 24 * 60 * 60
            },
            rangeRequests: true,
            // cacheableResponse: {
            //   statuses: [0, 200]
            // }
            // plugins: [
            //   new RangeRequestsPlugin(), 
            //   new CacheableResponsePlugin({
            //     statuses: [0, 200]
            //   }),
            // ],
          }
        },
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
  // configureWebpack: (config) => {
  //   if (process.env.npm_config_report) {
  //     const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  //     config.plugins.push(new BundleAnalyzerPlugin())
  //   }
  // },
  configureWebpack: {
    plugins: [
      new PreloadWebpackPlugin({
        rel: 'preload', // 可以是preload或prefetch，这里我们使用preload
        as(entry) { // 自动推断资源类型
          if (/\.js$/.test(entry)) return 'script';
          if (/\.css$/.test(entry)) return 'style';
          if (/\.woff2?(\?v=\d+\.\d+\.\d+)?$/i.test(entry)) return 'font';
          if (/\.png|\.jpg|\.jpeg|\.svg|\.gif|\.ico/i.test(entry)) return 'image';
        },
        include: 'initial', // 只预加载初始chunk
        fileBlacklist: [/\.map$/, /hot-update\.js$/], // 排除source map和hot update chunk
      }),
      new PreloadWebpackPlugin({
        rel: 'prefetch',
        include: 'asyncChunks', // 预获取异步chunk
        // chunks: ['nonCriticalChunk'], // 针对特定的chunk名称，你可以根据实际情况替换
      }),
    ],
  },
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
}
