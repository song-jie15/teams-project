import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  configPrettier, // 👈 关闭 ESLint 的格式规则
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      // 👇 完全对齐你的 .prettierrc
      'prettier/prettier': [
        'error',
        {
          semi: false, // 无分号
          singleQuote: true, // 单引号
          trailingComma: 'none' // 无尾逗号
        }
      ],
      'no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/valid-template-root': 'off',
      'no-console': 'off',
      'no-debugger': 'off'
    }
  }
]
