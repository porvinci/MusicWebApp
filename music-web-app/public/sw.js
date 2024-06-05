importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js')
console.log('service worker loaded, hello no yes')
if (workbox) {
  console.log('workbox加载完成')
}
const CACHE_NAME = 'PWA_SW_DEMO_V1'
const CACHE_LIST = [
  '/',
  '/favicon.ico',
  // '/dist/css/app.[contenthash].css',
  // '/dist/js/app.[chunkhash].js',
]
// '/assets/fonts/music-icon.ttf',
// '/assets/fonts/music-icon.svg',
// '/assets/images/default.png',
// '/img/no-result@3x.d1b976ec.png',
// '/recommend',
// '/main.js',
const IMAGE_PATTERN = /\.(png|jpg|jpeg|gif|svg)$/

self.addEventListener('install', function(event) {
  console.log('1')
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_LIST)
    })
  )
})

self.addEventListener('activate', function(event) {
  console.log('2')
})


// self.addEventListener('fetch', function(event) {
//   console.log('fetcgggggggg')
//   // 如果请求的是图片资源
//   if (IMAGE_PATTERN.test(new URL(event.request.url).pathname)) {
//     event.respondWith(
//       caches.match(event.request).then(function(response) {
//         // 如果缓存中有图片，直接返回
//         if (response) {
//           console.log('有')
//           return response
//         }
//         // 如果缓存中没有，从网络获取并添加到缓存
//         return fetch(event.request).then(function(response) {
//           if (!response || response.status !== 200 || response.type !== 'basic') {
//             return response
//           }
//           const responseToCache = response.clone();
//           console.log('无')
//           caches.open(CACHE_NAME).then(function(cache) {
//             cache.put(event.request, responseToCache)
//           })
//           return response
//         })
//       })
//     )
//   } else {
//     // 对于非图片资源，你可以选择直接从网络获取或者应用其他的缓存策略
//     event.respondWith(fetch(event.request))
//   }
// })
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         // 如果缓存中有匹配的资源，直接返回
//         if (response) {
//           return response;
//         }
//         // 否则，从网络获取资源，并考虑缓存它
//         return fetch(event.request).then(
//           function(response) {
//             if (!response || response.status !== 200 || response.type !== 'basic') {
//               return response;
//             }
//             var responseToCache = response.clone();
//             caches.open('my-cache-name').then(function(cache) {
//               cache.put(event.request, responseToCache);
//             });
//             return response;
//           }
//         );
//       })
//       .catch(function() {
//         // 网络请求失败时，可以返回一个自定义的离线页面或之前缓存的页面
//       })
//   );
// });