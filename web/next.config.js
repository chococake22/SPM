/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  future: {
    strictPostcssConfiguration: true, // PostCSS 설정을 더 엄격하게 적용
  },
};

module.exports = nextConfig;
