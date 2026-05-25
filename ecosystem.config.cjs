module.exports = {
  apps: [
    {
      name: 'tc-website',
      script: './node_modules/.bin/next',
      args: 'start -p 5005',
      cwd: '/var/www/websites/twelve-creative-website',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 5005,
      },
      error_file: '/root/.pm2/logs/tc-website-error.log',
      out_file: '/root/.pm2/logs/tc-website-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
