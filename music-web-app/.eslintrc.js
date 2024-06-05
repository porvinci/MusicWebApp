module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    indent: 0,
    'space-before-function-paren': 0,
    'no-multiple-empty-lines': 'off',
    'vue/multi-word-component-names': 'off',
    'comma-dangle': ['error', {
      // 默认的comma-dangle规则配置
      arrays: 'always-multiline', // 或其他配置
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
  },
  overrides: [
    {
      // 匹配你要忽略规则的文件或目录
      files: ['src/**/*.{vue,js}'],
      rules: {
        // 在这些文件中禁用comma-dangle规则
        'comma-dangle': 'off',
      },
    },
  ],
}
