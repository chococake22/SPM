import type { Config } from 'tailwindcss';
import lineClamp from '@tailwindcss/line-clamp'; // require 대신 import 사용

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    lineClamp, // 플러그인 추가
  ],
};

export default config;
