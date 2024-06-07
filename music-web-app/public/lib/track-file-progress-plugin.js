import { WorkboxPlugin } from 'workbox-core'
export class TrackFileProgressPlugin {
  constructor() {
      /**
       * Called before a Response is used to update a cache
       * @return {Response|null} - Return null to avoid caching
       */
      // 这是一个通信通道，在同源策略限制下的不同浏览器上下文（比如不同的标签页、窗口、iframe）
      // 之间进行高效、双向的消息传递。这个特性特别适用于需要在多个页面或应用组件间同步数据
      // 或状态的场景，比如多标签页之间的实时通信、通知推送、数据同步等
      this.broadcast = new BroadcastChannel('AudioDownloads')
      // 在使用 Response 更新缓存之前调用。在此方法中，可以在将响应添加到缓存之前对其进行更改，也可以返回 null 以避免彻底更新缓存
      // state 对象使一个回调能够根据同一插件中另一个回调所执行的操作有条件地执行某项任务
      // 具体实现的任务：向客户端发送进度
      this.cacheWillUpdate = async ({ request, response, event, state }) => {
          if (!shouldCacheResponse(response)) return null
          // Helper function for sending progress to client
          // Added to state object so cacheDidUpdate method can access it
          // 在state上挂载一个方法，该方法会向通道发送下载进度的消息
          state.reportProgress = (progressPercent) => {
              this.broadcast.postMessage({
                  type: 'DOWNLOAD_PROGRESS',
                  url: request.url,
                  progress: progressPercent,
              });
          };
          // Clone response b/c stream can only be used once (either for tracking download
          // or for saving to cache, not both)
          // 克隆响应对象，因为原生响应的流只能被消费一次，这里是为了既能跟踪下载进度又能将响应保存到缓存。
          const clonedResponse = await response.clone();
          // 跟踪下载进度
          trackDownloadProgress(clonedResponse, state.reportProgress);
          // Response is ready to cache
          if (response.status === 200 && response.headers.has('content-range')) {
              return response;
          }
          // Convert status from 206 -> 200 to make it cacheable (needed if response was
          // requested by fetch instead of by an Audio element)
          const status = 200;
          // Add content-range header if missing from 200 response (needed for iOS Safari)
          const headers = new Headers(response.headers);
          if (!response.headers.has('content-range')) {
              const contentLength = getFileSize(response);
              headers.set('content-range', `bytes 0-${contentLength - 1}/${contentLength}`);
          }
          return new Response(response.body, { status, headers });
      };
      /**
       * Called after Response is successfully saved to cache
       */
      // 在缓存中添加了新条目或更新现有条目时调用。如果您想在缓存更新后执行操作，那么使用此方法的插件可能会很有用
      this.cacheDidUpdate = async ({ state }) => {
          // Optional: guarantee that file is marked as fully downloaded in the event
          // that progress tracking fails
          if (state.reportProgress)
              state.reportProgress(1);
      };
  }
}
// Helper function for tracking download progress
// Adapted from: https://github.com/AnthumChris/fetch-progress-indicators/blob/master/sw-basic/sw-simple.js#L41
function trackDownloadProgress(response, reportProgress) {
  // Start tracking
  reportProgress(0);
  let totalBytes;
  try {
      // Ensure that the browser supports ReadableStream and we know total file size
      if (!response.body)
          throw 'response.body missing';
      totalBytes = getFileSize(response);
  }
  catch (error) {
      console.error('Failed to track download progress', error);
      return;
  }
  let loadedBytes = 0;
  // 从响应的body中按块读取数据；response.body是一个ReadableStream
  // 返回的reader与该可读流相锁定
  const reader = response.body.getReader();
  // 创建一个自定义流，从response.body中读取分块并放入到这个新的流中
  new ReadableStream({
      async start(controller) {
          read();
          function read() {
              reader
                  .read()
                  .then(({ done, value }) => {
                  if (done) {
                      controller.close();
                      return;
                  }
                  // 把数据value放入到自定义的流中
                  controller.enqueue(value);
                  loadedBytes += value.byteLength;
                  reportProgress(loaded / totalBytes);
                  read();
              })
                  .catch((error) => {
                  // Error only typically occurs if network fails mid-download
                  console.error('error in read()', error);
                  controller.error(error);
              });
          }
      },
      // Firefox excutes this on page stop, Chrome does not
      cancel(reason) {
          console.log('cancel()', reason);
      },
  });
}
/**
* Get total file size in bytes 文件总大小
*/
function getFileSize(response) {
  // If content is encoded, then content-length will not be accurate
  if (response.headers.get('content-encoding'))
      throw 'content-encoding header';
  // We use content-length header to get total file size
  const contentLength = response.headers.get('content-length');
  if (contentLength === null)
      throw 'content-length missing';
  return parseInt(contentLength);
}
/**
* Only cache file if the full file is provided. Don't cache
* partial 206 responses
*/
function shouldCacheResponse(response) {
  if (response.status === 200) {
      // Ensure the file size is known (to derive content-range header)
      try {
          getFileSize(response);
      }
      catch (err) {
          return false;
      }
      return true;
  }
  if (response.status === 206) {
      try {
          // Did 206 response include entire file?
          const contentLength = getFileSize(response);
          return (`bytes 0-${contentLength - 1}/${contentLength}` ===
              response.headers.get('content-range'));
      }
      catch (err) { }
  }
  return false;
}