/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/*.html"],
  theme: {
    extend: {
      scrollbar: {
        DEFAULT: {
          thumb: "rounded-full bg-gray-300",
          track: "bg-transparent",
        },
      },
    },
    fontFamily: {
      get: ["GangwonEduPowerExtraBoldA"],
      nsk: ["Noto Sans KR"],
    },
  },
  plugins: [require("tailwind-scrollbar-hide"), require("tailwind-scrollbar")],
};
