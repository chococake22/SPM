const path = require('path');

module.exports = {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    // domains: ['localhost'], // ← 개발용
    domains: ['fightest21.cafe24.com'], // ← 배포용
  },
};
