import { get } from './base'

export function getTopList() {
  return get('/api/getTopList')
}

export function getTopListDetail(list) {
  return get('/api/getTopDetail', {
    id: list.id,
    period: list.period,
  })
}
