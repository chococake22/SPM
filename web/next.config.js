/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  future: {
    strictPostcssConfiguration: true, // PostCSS 설정을 더 엄격하게 적용
  },
};

module.exports = nextConfig;
