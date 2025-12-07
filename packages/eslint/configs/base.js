import eslint from '@eslint/js';
import sonar from 'eslint-plugin-sonarjs'
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  sonar.configs.recommended,
  {
    rules: {
      //FORMATTING
      'max-lines': ['error', {max: 200, skipBlankLines: true}],
      'indent': ['error', 2],
      'quotes': ['warn', 'single'],
      'arrow-spacing': ['error', {'before': true, 'after': true}],
      'curly': ['error'],
      'no-label-var': ['error'],
      'no-unused-vars': ['off'],
      '@typescript-eslint/ban-ts-comment': ['off'],
      'sonarjs/todo-tag': ['off'],
      '@typescript-eslint/no-explicit-any': ['off'],
      'no-unreachable': ['error'],
      '@typescript-eslint/no-unused-vars': ['error', {
        'varsIgnorePattern': '^_',
        'argsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_'
      }],
      'max-lines-per-function': ['error', 80],
      'no-var': ['error'],
      'prefer-const': ['error'],
      'no-useless-catch': ['error'],
      'no-loop-func': ['error'],
      'eqeqeq': ['error'],
      'max-nested-callbacks': ['error', 5],
      'sonarjs/cognitive-complexity': ['error', 12],
      'sonarjs/no-duplicate-string': ['error'],
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-empty-collection': 'error',
      'sonarjs/prefer-single-boolean-return': ['error'],
      'sonarjs/no-all-duplicated-branches': ['error'],
    },
  }
);
