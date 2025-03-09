/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // 使用class策略而不是媒体查询
  theme: {
    extend: {
      screens: {
        'xs': '480px',    // 额外的小尺寸移动设备
        'sm': '640px',    // 小尺寸平板和大尺寸手机
        'md': '768px',    // 中等尺寸平板
        'lg': '1024px',   // 笔记本电脑和小尺寸桌面
        'xl': '1280px',   // 中等尺寸桌面
        '2xl': '1536px',  // 大尺寸桌面
      },
    },
  },
  plugins: [],
}

