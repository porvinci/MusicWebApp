<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input
      class="input-inner"
      v-model="newQuery"
      :placeholder="placeholder"
    />
    <i
      class="icon-dismiss"
      v-show="newQuery"
      @click="clear"
    ></i>
  </div>
</template>

<script>
  import { debounce } from 'throttle-debounce'

  export default {
    name: 'search-input',
    props: {
      modelValue: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '搜索歌手、歌曲',
      }
    },
    data() {
      return {
        newQuery: this.modelValue
      }
    },
    watch: {
      modelValue(val) {
        this.newQuery = val
      }
    },
    // watch: {
    //   newQuery(newV) {
    //     this.$emit('update:modelValue', newV)
    //   }
    // },
    methods: {
      clear() {
        this.newQuery = ''
      }
    },
    created() {
      this.$watch('newQuery', debounce(300, newV => this.$emit('update:modelValue', newV)))
    },
  }
</script>

<style lang="scss" scoped>
  .search-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }
    .input-inner {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
