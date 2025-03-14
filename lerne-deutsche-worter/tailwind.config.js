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
      colors: {
        // 扩展颜色
        primary: {
          DEFAULT: '#3b82f6', // 蓝色
          light: '#60a5fa',
          dark: '#2563eb',
        },
        background: {
          light: '#ffffff',
          dark: '#121212',
        },
        text: {
          light: '#171717',
          dark: '#e5e5e5',
        },
        card: {
          light: '#ffffff',
          dark: '#1e1e1e',
        },
        border: {
          light: '#e5e7eb',
          dark: '#2e2e2e',
        },
      },
      // 添加过渡效果
      transitionProperty: {
        'theme': 'background-color, color, border-color, fill, stroke',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}

