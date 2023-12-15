# PM2 方式部署

使用 `PM2` 部署在服务器上。

## 环境需求

- `Node.js` >= `16.10.0`
- `MongoDB` >= `4.4.0`
- `Redis` >= `6.2.0`

## 编译代码

-- 编译并打包；文件位置在 `.deploy/` 下

```bash
# 默认文件名 playground.tar.gz
sh build.sh --tar

# 自定义文件名 myapp.tar.gz
sh build.sh --tar myapp
```

## 部署到服务器

-- 创建并进入工作目录

```bash
mkdir -p /home/playground && cd /home/playground
```

-- 上传打包的文件 `playground.tar.gz` 并解压

```bash
tar -zxvf playground.tar.gz
```

-- 上传 `ecosystem.config.js` ; 进行编辑修改相应参数

```js
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
```

-- 安装 `npm` 模块

```bash
make install
```

-- 启动服务

```bash
make start
```

-- 停止服务

```bash
make stop
```

-- 重启服务

```bash
make restart
```

-- 删除服务

```bash
make delete
```