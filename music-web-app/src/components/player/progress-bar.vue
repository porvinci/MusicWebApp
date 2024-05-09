<template>
  <div
    class="progress-bar"
    @click="onClick"
  >
    <div class="bar-inner">
      <div
        class="progress"
        ref="progress"
        :style="progressStyle"
      ></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const btnWidth = 16
  export default {
    name: 'progress-bar',
    props: {
      progress: {
        type: Number,
        default: 0,
      }
    },
    emits: ['progress-changing', 'progress-changed'],
    data() {
      return {
        offset: 0,
      }
    },
    watch: {
      progress(newProgress) {
        this.offset = newProgress * (this.$el.clientWidth - btnWidth)
      }
    },
    computed: {
      progressStyle() {
        return `width: ${this.offset}px`
      },
      btnStyle() {
        return `transform: translate3d(${this.offset}px, 0, 0)`
      },
    },
    created() {
      // 共享对象
      this.touch = {}
    },
    methods: {
      onTouchStart(e) {
        this.touch.x1 = e.touches[0].pageX
        this.touch.startWidth = this.$refs.progress.clientWidth
      },
      onTouchMove(e) {
        this.touch.x2 = e.touches[0].pageX
        const delta = this.touch.x2 - this.touch.x1
        const tmpWidth = this.touch.startWidth + delta
        const p = Math.min(1, Math.max(0, tmpWidth / (this.$el.clientWidth - btnWidth)))
        this.offset = p * (this.$el.clientWidth - btnWidth)
        this.$emit('progress-changing', p)
      },
      onTouchEnd() {
        const p = this.$refs.progress.clientWidth / (this.$el.clientWidth - btnWidth)
        this.offset = p * (this.$el.clientWidth - btnWidth)
        this.$emit('progress-changed', p)
      },
      onClick(e) {
        const clickX = e.pageX
        const offsetLeft = this.$el.getBoundingClientRect().left
        const p = (clickX - offsetLeft) / (this.$el.clientWidth - btnWidth)
        this.offset = p * (this.$el.clientWidth - btnWidth)
        this.$emit('progress-changed', p)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
