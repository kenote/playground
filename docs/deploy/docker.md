# Docker 方式部署

使用 `Docker Compose` 部署

## 编译代码

-- 编译并打包；文件位置在 `.deploy/docker` 下

```bash
# 编译当前系统平台
sh docker.sh

# 编译指定平台
sh docker.sh --platform linux/amd64
```

## 部署到服务器

-- 创建并进入工作目录

```bash
mkdir -p /home/docker/playground && cd /home/docker/playground
```

-- 上传打包的文件 `playground_api_server.tar`、`playground_web_server.tar`、`api_server.tar.gz`

-- 导入镜像

```bash
docker load < playground_api_server.tar
docker load < playground_web_server.tar
```

-- 解压配置文件

```bash
tar -zxvf api_server.tar.gz
```

-- 拉取 `compose` 文件

```bash
wget --no-check-certificate -qO docker-compose.yml https://raw.githubusercontent.com/kenote/playground/main/docker/compose.yml

wget --no-check-certificate -qO .env https://raw.githubusercontent.com/kenote/playground/main/docker/.env.example
```

-- 编辑环境变量 `.env`

```ini
# API 请求URL
API_BASEURL=http://loclhost:4000
# API 服务端口
API_SERVER_PORT=4000
# WEB 服务端口
WEB_SERVER_PORT=3000
# 站点名称
SITE_NAME=站点名称
# 站点URL
SITE_URL=http://loclhost:3000

# MongoDB 设置
MONGODB_HOST=mongodb
MONGODB_PORT=27017
MONGODB_USER=
MONGODB_PASS=
SERVER_NAME=api_server

# Redis 设置
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASS=

# 初始化管理员密码
ADMIN_NAME=admin
ADMIN_PASS=admin888
```

-- 启动服务

```bash
docker-compose up -d
```

-- 卸载服务

```bash
docker-compose down
```

-- 重启服务

```bash
docker-compose restart
```