# Playground



## 使用 Docker

- 运行开发环境

```bash
# 启动服务
docker-compose -f docker-compose.dev.yml up -d --build
# 关闭服务
docker-compose -f docker-compose.dev.yml down
# 关闭服务并删除容器
docker-compose -f docker-compose.dev.yml down -v
```

- 运行生产环境

```bash
# 启动服务
docker-compose -f docker-compose.prod.yml up -d --build
# 关闭服务
docker-compose -f docker-compose.prod.yml down
# 关闭服务并删除容器
docker-compose -f docker-compose.prod.yml down -v
```

- 查看日志

```bash
docker logs -f --tail 10 playground_api-server
```

- 进入容器内部, 输入 exit 退出

```bash
docker exec -it playground_api-server /bin/sh
```

- 编译代码 (开发环境下)

```bash
docker exec -it playground_api-server /bin/sh -c 'npm run build'
```

- 编译镜像文件

```bash
# 编辑成镜像
docker build -f api-server/Dockerfile.prod --platform=linux/amd64 --tag playground_api_server:latest .
# 镜像打包
docker save > .docker/export/playground_api_server.tar playground_api_server:latest
# 镜像解包
docker load < playground_api_server.tar
```