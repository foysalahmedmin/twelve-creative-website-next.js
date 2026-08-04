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
      // The admin-upload proxy (src/app/api/admin-upload/route.ts) buffers
      // the whole file via req.formData() before re-forwarding it to the
      // backend, so this must clear baseline usage (~400M) plus a full
      // MAX_UPLOAD_BYTES (1G) file, or PM2 kills the process mid-upload.
      max_memory_restart: '2048M',
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
