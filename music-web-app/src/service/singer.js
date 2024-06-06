import { get } from './base'

export function getSingerList() {
  return get('/apii/getSingerList')
}

export function getSingerDetail(mid) {
  return get('/apii/getSingerDetail', {
    mid: mid
  })
}
