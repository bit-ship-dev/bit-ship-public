import base from './base.js';
import pluginVue from 'eslint-plugin-vue'

export default [
  base,
  pluginVue.configs.essential,
  {
  rules: {
    'vue/require-v-for-key': 'error',
    'vue/no-use-v-if-with-v-for': 'error',
    'vue/no-v-text-v-html-on-component': 'error',
    'vue/block-lang': ['error', {'script': {'lang': 'ts'}}],
    'vue/script-setup-uses-vars': 'error',
    'vue/valid-v-for': 'error',
    'vue/no-export-in-script-setup': ['error'],
    'vue/max-len': ['error', 140],
    'vue/no-unused-vars': ['error', {'ignorePattern': '^_'}],
    "@typescript-eslint/ban-ts-comment": "off",
    'vue/eqeqeq': 'error',
    'vue/no-ref-as-operand': 'error',
    'vue/valid-define-props': 'error',
    'vue/attribute-hyphenation': 'error',
    "@typescript-eslint/no-explicit-any" : "off",
    'vue/no-reserved-keys': 'error',
    'vue/no-use-computed-property-like-method': 'error',
    'vue/no-async-in-computed-properties': 'error',
    'vue/no-dupe-keys': 'error',
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'always',
        'normal': 'never',
        'component': 'any'
      },
      'svg': 'always',
      'math': 'always'
    }],
    'vue/one-component-per-file': 'error',
    'vue/html-closing-bracket-newline': [
      'error',
      {
        'singleline': 'never',
        'multiline': 'always'
      }
    ],
    'vue/custom-event-name-casing': ['off'],
    'vue/func-call-spacing': ['error', 'never'],
    'vue/valid-define-emits': ['error'],
    'vue/no-computed-properties-in-data': 'error',
    'vue/mustache-interpolation-spacing': ['error', 'always'],
    'vue/multiline-html-element-content-newline': ['error'],
    'vue/no-side-effects-in-computed-properties': 'error',
    'vue/component-tags-order': [
      'error',
      {'order': [['template', 'script'], 'style']}
    ],
    'vue/require-prop-type-constructor': 'error',
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        'startTag': 'never',
        'endTag': 'never',
        'selfClosingTag': 'always'
      }
    ],
  },
  }
]
