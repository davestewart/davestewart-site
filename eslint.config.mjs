// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Ignore patterns (migrated from .eslintignore)
  {
    ignores: [
      'dist',
      '.output',
      '.nuxt',
      'node_modules',
      'app/utils/media.js', // Has unreachable code
    ],
  },
  {
    files: ['**/*.ts', '**/*.cts', '**/*.mts'],
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-undef': 'off', // TypeScript handles this
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: (await import('vue-eslint-parser')).default,
      parserOptions: {
        parser: (await import('@typescript-eslint/parser')).default,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-undef': 'off', // TypeScript handles this
    },
  },
  // Your custom configs here will be merged with the Nuxt config
  {
    rules: {
      // Stylistic rules
      // '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/brace-style': ['error', 'stroustrup'],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      '@stylistic/operator-linebreak': 'off',

      // Prefer function declarations over expressions
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],

      // Vue specific customizations
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': ['error', {
        singleline: 3,
        multiline: 1,
      }],
    },
  },
  {
    // Relax rules for content files (blog posts, examples, etc.)
    files: ['content/**/*.{js,ts}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-unreachable': 'off',
    },
  },
)
