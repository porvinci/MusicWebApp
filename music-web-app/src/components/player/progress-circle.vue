<template>
  <div class="progress-circle">
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  import { inject, computed, ref } from 'vue'
  export default {
    name: 'progress-circle',
    props: {
      radius: {
        type: Number,
        default: 100,
      },
    },
    setup() {
      const progress = inject('progress')
      const dashArray = ref(Math.PI * 100)
      const dashOffset = computed(() => dashArray.value * (1 - progress.value))
      return {
        dashArray,
        dashOffset,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .progress-circle {
    position: relative;
    circle {
    /* 圆边框的宽度*/
      stroke-width: 8px;
      // 指定元素在进行变换（如旋转、缩放或倾斜）时的基点位置
      transform-origin: center;
      &.progress-background {
        // 将圆环缩小到原来的90%
        transform: scale(0.9);
        // 圆的边框颜色（暗黄色）
        stroke: $color-theme-d;
      }
      &.progress-bar {
        // 逆时针旋转90度
        transform: scale(0.9) rotate(-90deg);
        // 明黄色
        stroke: $color-theme;
      }
    }
  }
</style>
