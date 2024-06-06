import { get } from './base'

export function getTopList() {
  return get('/apii/getTopList')
}

export function getTopListDetail(list) {
  return get('/apii/getTopDetail', {
    id: list.id,
    period: list.period,
  })
}
