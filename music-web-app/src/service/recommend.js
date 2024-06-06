import { get } from './base'

export function getRecommend() {
  return get('/apii/getRecommend')
}

export function getAlbum(album) {
  return get('/apii/getAlbum', {
    id: album.id
  })
}
