module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@themesberg/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      grayscale: {
        50: '50%',
        100: '100%'
      }
    }
  },
  // eslint-disable-next-line global-require
  plugins: [require('@themesberg/flowbite/plugin')]
}
