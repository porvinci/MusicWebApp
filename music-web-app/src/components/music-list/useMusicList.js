import { ref, onMounted } from 'vue'

export default function useMusicList() {
  const bgImage = ref(null)
  onMounted(() => {
    console.log('vue3', bgImage.value.clientWidth, bgImage.value.clientHeight)
  })
  return {
    bgImage
  }
}
