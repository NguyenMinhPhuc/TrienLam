module.exports = {
  apps: [
    {
      name: 'trien-lam',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3127',
      env: {
        NODE_ENV: 'production',
      }
    }
  ]
};
