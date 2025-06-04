require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'SPM-back',
      script: 'src/index.ts',
      interpreter: 'ts-node',
      env: {
        REDIS_PORT: process.env.REDIS_PORT,
        DB_URL: process.env.DB_URL,
        JWT_SECRET: process.env.JWT_SECRET,
      },
    },
  ],
};
