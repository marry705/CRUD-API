module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    extends: [
      'plugin:@typescript-eslint/recommended'
    ],
    plugins: ["@typescript-eslint"],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-use-before-define': 'off',
      'max-len': ['error', { code: 160, tabWidth: 4 }],
      'quotes': ['error', 'single', { 'avoidEscape': true }]
    },
};