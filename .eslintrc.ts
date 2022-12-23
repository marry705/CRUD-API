module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    extends: [
      'plugin:@typescript-eslint/recommended'
    ],
    rules: {
      '@typescript-eslint/no-var-requires': 0,
      'no-use-before-define': 'off',
      'max-len': ['error', { code: 160, tabWidth: 4 }],
      'quotes': ['error', 'single', { 'avoidEscape': true }]
    },
};