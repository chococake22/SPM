module.exports = {
  apps: [
    {
      name: 'SPM-back',
      script: 'src/index.ts',
      interpreter: 'ts-node',
      env: {
        NODE_ENV: 'production', // 선택
      },
    },
  ],
};

