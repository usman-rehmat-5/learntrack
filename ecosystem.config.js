module.exports = {
  apps: [{
    name: 'learntrack',
    script: 'server/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_file: 'server/.env',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    merge_logs: true,
    max_memory_restart: '500M',
    watch: false
  }]
};
