module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '900px',
    },
    extend: {
      colors: {
        'padlok-blue': '#1F4483',
        'padlok-cyan': '#3BBDFF',
        'skintone': {
          0: '#F6D040',
          1: '#F5DDC0',
          2: '#DABC9A',
          3: '#B8916F',
          4: '#936644',
          5: '#56463B',
        },
      },
      fontFamily: {
        'hkgrotesk-black': ['HKGrotesk-Black', 'sans-serif'],
        'hkgrotesk-semibold': ['HKGrotesk-SemiBold', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-safe-area'),
  ],
}
