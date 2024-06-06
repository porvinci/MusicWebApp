import { get } from './base'

export function getHotKeys() {
  return get('/apii/getHotKeys')
}

export function searchQuery(query, page, showSinger) {
  return get('/apii/search', {
    query,
    page,
    showSinger,
  })
}
