const axios = require('axios')
const pinyin = require('pinyin')
const Base64 = require('js-base64').Base64
// 获取签名方法
const getSecuritySign = require('./sign')

const ERR_OK = 0
const token = 5381

// 歌曲图片加载失败时使用的默认图片
const fallbackPicUrl = 'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'

// 公共参数
const commonParams = {
  g_tk: token,
  loginUin: 0,
  hostUin: 0,
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  needNewCode: 0,
  format: 'json',
  platform: 'yqq.json'
}

// 获取一个随机数值
function getRandomVal(prefix = '') {
  return prefix + (Math.random() + '').replace('0.', '')
}

// 获取一个随机 uid
function getUid() {
  const t = (new Date()).getUTCMilliseconds()
  return '' + Math.round(2147483647 * Math.random()) * t % 1e10
}

// 对 axios get 请求的封装
// 修改请求的 headers 值，合并公共请求参数
function get(url, params) {
  return axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com/'
    },
    params: Object.assign({}, commonParams, params)
  })
}

// 对 axios post 请求的封装
// 修改请求的 headers 值
function post(url, params) {
  return axios.post(url, params, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com/',
      'Content-Type': 'application/json'
    }
  })
}

// 处理歌曲列表
function handleSongList(list) {
  const songList = []

  list.forEach((item) => {
    const info = item.songInfo || item
    if (info.pay.pay_play !== 0 || !info.interval) {
      // 过滤付费歌曲和获取不到时长的歌曲
      return
    }

    // 构造歌曲的数据结构
    const song = {
      id: info.id,
      mid: info.mid,
      name: info.name,
      singer: mergeSinger(info.singer),
      url: '', // 在另一个接口获取
      duration: info.interval,
      pic: info.album.mid ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${info.album.mid}.jpg?max_age=2592000` : fallbackPicUrl,
      album: info.album.name
    }

    songList.push(song)
  })

  return songList
}

// 合并多个歌手的姓名
function mergeSinger(singer) {
  const ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
module.exports = (req, res) => {
  console.log('front1', req.query)
  console.log('mid', req.query['mid[]'])
  console.log('length', req.query['mid[]'].length)
  const mid = req.query['mid[]']

  let midGroup = []
  // 第三方接口只支持最多处理 100 条数据，所以如果超过 100 条数据，我们要把数据按每组 100 条切割，发送多个请求
  if (mid.length > 100) {
    const groupLen = Math.ceil(mid.length / 100)
    for (let i = 0; i < groupLen; i++) {
      midGroup.push(mid.slice(i * 100, (100 * (i + 1))))
    }
  } else {
    midGroup = [mid]
  }

  // 以歌曲的 mid 为 key，存储歌曲 URL
  const urlMap = {}

  // 处理返回的 mid
  function process(mid) {
    const data = {
      req_0: {
        module: 'vkey.GetVkeyServer',
        method: 'CgiGetVkey',
        param: {
          guid: getUid(),
          songmid: mid,
          songtype: new Array(mid.length).fill(0),
          uin: '0',
          loginflag: 0,
          platform: '23',
          h5to: 'speed'
        }
      },
      comm: {
        g_tk: token,
        uin: '0',
        format: 'json',
        platform: 'h5'
      }
    }

    const sign = getSecuritySign(JSON.stringify(data))
    const url = `https://u.y.qq.com/cgi-bin/musics.fcg?_=${getRandomVal()}&sign=${sign}`

    // 发送 post 请求
    return post(url, data).then((response) => {
      const data = response.data
      console.log('data', data)
      if (data.code === ERR_OK) {
        console.log('data.req_0.data', data.req_0.data)
        const midInfo = data.req_0.data.midurlinfo
        const sip = data.req_0.data.sip
        const domain = sip[sip.length - 1]
        console.log('midInfo', midInfo)
        console.log('sip', sip)
        console.log('domain', domain)
        midInfo.forEach((info) => {
          // 获取歌曲的真实播放 URL
          if (info.purl) {
            console.log('purl', info.purl)
            urlMap[info.songmid] = domain + info.purl
          }
        })
      }
    })
  }

  // 构造多个 Promise 请求
  const requests = midGroup.map((mid) => {
    return process(mid)
  })

  // 并行发送多个请求
  return Promise.all(requests).then(() => {
    // 所有请求响应完毕，urlMap 也就构造完毕了
    res.json({
      code: ERR_OK,
      result: {
        map: urlMap
      }
    })
  })
}