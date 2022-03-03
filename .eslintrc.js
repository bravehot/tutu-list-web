module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'airbnb-base',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.js', '.jsx', '.json', '.vue']
      }
    }
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'no-undef': 'off',
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true, argsIgnorePattern: '^_' }
    ]
  }
}
