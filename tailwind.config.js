/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/*.html"],
  theme: {
    extend: {},
    fontFamily: {
      get: ["GangwonEduPowerExtraBoldA"],
      nsk: ["Noto Sans KR"],
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};