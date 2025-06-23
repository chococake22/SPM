const path = require('path');
const dotenv = require('dotenv');

// .env 파일을 불러옴
dotenv.config();

const domain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost';

console.log("domain: " + domain)

module.exports = {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http', // HTTPS 안 씀
        hostname: domain,
        port: '', // 필요 시 포트 명시 (예: '8080') 안 쓰면 생략
        pathname: '**', // 경로 전체 허용 (옵션)
      },
    ],
  },
};
