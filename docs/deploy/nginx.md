# 配置 Nginx

配置 `nginx` 代理

## 前端配置

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.domain.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_redirect off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy ture;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 后端 API 配置

```nginx

server {
    listen 80;
    listen [::]:80;
    server_name demo.domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_redirect off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy ture;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```