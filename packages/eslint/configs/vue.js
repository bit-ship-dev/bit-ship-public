import base from './base.js';

export default [
  base,
  {
    rules: {
      'nuxt/require-v-for-key': 'error',
      'nuxt/no-use-v-if-with-v-for': 'error',
      'nuxt/no-v-text-v-html-on-component': 'error',
      'nuxt/block-lang': ['error', { 'script': { 'lang': 'ts' } }],
      'nuxt/script-setup-uses-vars': 'error',
      'nuxt/valid-v-for': 'error',
      'nuxt/no-export-in-script-setup': ['error'],
      'nuxt/max-len': ['error', 140],
      'nuxt/no-unused-vars': ['error', { 'ignorePattern': '^_' }],
      "@typescript-eslint/ban-ts-comment": "off",
      'nuxt/eqeqeq': 'error',
      'nuxt/no-ref-as-operand': 'error',
      'nuxt/valid-define-props': 'error',
      'nuxt/attribute-hyphenation': 'error',
      "@typescript-eslint/no-explicit-any": "off",
      'nuxt/no-reserved-keys': 'error',
      'nuxt/no-use-computed-property-like-method': 'error',
      'nuxt/no-async-in-computed-properties': 'error',
      'nuxt/no-dupe-keys': 'error',
      'nuxt/html-self-closing': ['error', {
        'html': {
          'void': 'always',
          'normal': 'never',
          'component': 'any'
        },
        'svg': 'always',
        'math': 'always'
      }],
      'nuxt/one-component-per-file': 'error',
      'nuxt/html-closing-bracket-newline': [
        'error',
        {
          'singleline': 'never',
          'multiline': 'always'
        }
      ],
      'nuxt/custom-event-name-casing': ['off'],
      'nuxt/func-call-spacing': ['error', 'never'],
      'nuxt/valid-define-emits': ['error'],
      'nuxt/no-computed-properties-in-data': 'error',
      'nuxt/mustache-interpolation-spacing': ['error', 'always'],
      'nuxt/multiline-html-element-content-newline': ['error'],
      'nuxt/no-side-effects-in-computed-properties': 'error',
      'nuxt/component-tags-order': [
        'error',
        { 'order': [['template', 'script'], 'style'] }
      ],
      'nuxt/require-prop-type-constructor': 'error',
      'nuxt/require-default-prop': 'error',
      'nuxt/require-prop-types': 'error',
      'nuxt/html-closing-bracket-spacing': [
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
