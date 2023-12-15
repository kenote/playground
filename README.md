# Playground

...

## 环境需求

- `Node.js` >= `16.10.0`
- `MongoDB` >= `4.4.0`
- `Redis` >= `6.2.0`

## 本地开发调试

-- 独立窗口运行 `api-server`

```bash
npm run dev --prefix ./api-server
```

-- 独立窗口运行 `web-server`

```bash
npm run dev --prefix ./web-server
```

## 服务器部署

- [PM2 方式部署](./docs/deploy/pm2.md)
- [Docker 方式部署](./docs/deploy/docker.md)
- [配置 Nginx 代理](./docs/deploy/nginx.md)