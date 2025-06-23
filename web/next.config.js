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
        port: '3001',
        pathname: '/storage/**',
      },
    ],
  },
};
