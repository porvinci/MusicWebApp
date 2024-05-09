import { ref, computed, watch } from 'vue'
import { useMusicPlayStore } from '@/store/musicPlay'

export default function useCd() {
  const cdImageRef = ref(null)
  const musicPlayStore = useMusicPlayStore()
  const playing = computed(() => musicPlayStore.playing)
  watch(playing, (newV) => {
    if (newV) cdImageRef.value.style.animationPlayState = 'running'
    else cdImageRef.value.style.animationPlayState = 'paused'
  })

  return {
    cdImageRef
  }
}
