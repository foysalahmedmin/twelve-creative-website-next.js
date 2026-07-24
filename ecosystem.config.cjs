module.exports = {
  apps: [
    {
      name: 'tc-website',
      script: 'node',
      // Only Nginx should reach Next.js directly in production.
      args: 'node_modules/next/dist/bin/next start --hostname 127.0.0.1',
      // Resolve from this tracked config so the checkout can live anywhere.
      cwd: __dirname,
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 5005,
      },
      // PM2's defaults keep logs under the account running the process.
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
