// PM2 Configure

module.exports = {
  apps: [
    // api-server
    {
      name: 'api-server',
      max_memory_restart: '200M',
      instances: 1,
      instance_var: 'api-server',
      exec_mode: 'cluster',
      cwd: './api-server/',
      env: {
        NODE_ENV: 'production',
        SERVER_PORT: 4000,
        SITE_NAME: '站点名称',
        SITE_URL: 'http://localhost:3000',
        MONGODB_HOST: 'localhost',
        MONGODB_PORT: 27017,
        REDIS_HOST: '127.0.0.1',
        REDIS_PORT: 6379,
        ADMIN_NAME: 'admin',
        ADMIN_PASS: 'admin888'
      },
      script: './dist/main.js',
      interpreter_args: '--harmony'
    },
    // web-server
    {
      name: 'web-server',
      max_memory_restart: '200M',
      instances: 1,
      instance_var: 'web-server',
      exec_mode: 'cluster',
      cwd: './web-server/',
      env: {
        NODE_ENV: 'production',
        NUXT_PUBLIC_API_BASE: 'http://localhost:4000',
        NITRO_PORT: 3000
      },
      script: 'npm',
      args: 'run preview',
      interpreter_args: '--harmony'
    }
  ]
}