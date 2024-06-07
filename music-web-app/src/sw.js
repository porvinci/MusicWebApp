// import { registerRoute } from 'workbox-routing';
// import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
// // import { CacheableResponsePlugin } from 'workbox-cacheable-response';
// import { RangeRequestsPlugin } from 'workbox-range-requests';
// // import { TrackFileProgressPlugin } from './lib/track-file-progress-plugin'; // to-do
// import { precacheAndRoute } from 'workbox-precaching';
// import { ExpirationPlugin } from 'workbox-expiration';
const { registerRoute } = require('workbox-routing')
const { CacheFirst, StaleWhileRevalidate, NetworkFirst } = require('workbox-strategies')
const { RangeRequestsPlugin } = require('workbox-range-requests')
const { precacheAndRoute } = require('workbox-precaching')
const { ExpirationPlugin } = require('workbox-expiration')
const { CacheableResponsePlugin } = require('workbox-cacheable-response')


precacheAndRoute([
  { url: '/index.html', revision: null },
]);
registerRoute(
  ({ request }) => {
    console.log('request destination', request.destination)
    // Match all relevant audio files here...
    return request.url.startsWith('https://isure.stream.qqmusic.qq.com')
  },
  new CacheFirst({
    cacheName: 'Audios',
    plugins: [
      // We must store full files in ServiceWorker cache, but this plugin allows
      // requests with range: header (e.g. from <audio> or <video> elements) to
      // be served only a portion of the cached file instead of the whole thing
      new RangeRequestsPlugin(), 
      // new CacheableResponsePlugin({
      //   statuses: [0, 200]
      // }),
      // Our custom plugin!
      // new TrackFileProgressPlugin(),
    ],
  })
);

registerRoute(
  ({ request }) => {
    return new RegExp('https:\/\/musicpwa\.vercel\.app\/apii\/getRecommend').test(request.url)
  },
  new NetworkFirst({
    cacheName: 'Recommend',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60
      })
    ],
  })
);

registerRoute(
  ({ request }) => {
    return new RegExp('https:\/\/musicpwa\.vercel\.app\/apii\/getHotKeys').test(request.url)
  },
  new StaleWhileRevalidate({
    cacheName: 'HotKeys',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 3 * 24 * 60 * 60
      })
    ],
  })
);


