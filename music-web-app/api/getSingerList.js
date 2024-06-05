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
module.exports =  (req, res) => {
  const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
  const HOT_NAME = '热'

  const data = JSON.stringify({
    comm: { ct: 24, cv: 0 },
    singerList: {
      module: 'Music.SingerListServer',
      method: 'get_singer_list',
      param: { area: -100, sex: -100, genre: -100, index: -100, sin: 0, cur_page: 1 }
    }
  })

  const randomKey = getRandomVal('getUCGI')
  const sign = getSecuritySign(data)

  get(url, {
    sign,
    '-': randomKey,
    data
  }).then((response) => {
    const data = response.data
    if (data.code === ERR_OK) {
      // 处理歌手列表数据
      const singerList = data.singerList.data.singerlist
      // 构造歌手 Map 数据结构
      const singerMap = {
        hot: {
          title: HOT_NAME,
          list: map(singerList.slice(0, 10))
        }
      }
      singerList.forEach((item) => {
        // 把歌手名转成拼音
        const p = pinyin(item.singer_name)
        if (!p || !p.length) {
          return
        }
        // 获取歌手名拼音的首字母
        const key = p[0][0].slice(0, 1).toUpperCase()
        if (key) {
          if (!singerMap[key]) {
            singerMap[key] = {
              title: key,
              list: []
            }
          }
          // 每个字母下面会有多名歌手
          singerMap[key].list.push(map([item])[0])
        }
      })

      // 热门歌手
      const hot = []
      // 字母歌手
      const letter = []

      // 遍历处理 singerMap，让结果有序
      for (const key in singerMap) {
        const item = singerMap[key]
        if (item.title.match(/[a-zA-Z]/)) {
          letter.push(item)
        } else if (item.title === HOT_NAME) {
          hot.push(item)
        }
      }
      // 按字母顺序排序
      letter.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      res.json({
        code: ERR_OK,
        result: {
          singers: hot.concat(letter)
        }
      })
    } else {
      res.json(data)
    }
  })
}

  // 做一层数据映射，构造单个 singer 数据结构
function map(singerList) {
  return singerList.map((item) => {
    return {
      id: item.singer_id,
      mid: item.singer_mid,
      name: item.singer_name,
      pic: item.singer_pic.replace(/\.webp$/, '.jpg').replace('150x150', '800x800')
    }
  })
}