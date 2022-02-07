module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@themesberg/flowbite/**/*.js'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('@themesberg/flowbite/plugin')]
}
