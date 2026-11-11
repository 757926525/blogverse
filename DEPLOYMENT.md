# 多平台全场景部署指南

本文档提供全平台生产部署指南，涵盖 **Cloudflare Pages**、**腾讯云 (EdgeOne / COS)**、**阿里云 (OSS / ESA)**、**Docker 容器化** 与 **Linux VPS / 独立主机 (Nginx / Caddy)**。

---

## 目录
1. [环境变量与核心参数](#环境变量与核心参数)
2. [Cloudflare Pages 部署 (含 D1+R2+KV 极速对接)](#1-cloudflare-pages-部署)
3. [腾讯云部署指南 (EdgeOne / COS 静态托管)](#2-腾讯云部署指南)
4. [阿里云部署指南 (OSS / ESA 边缘安全加速)](#3-阿里云部署指南)
5. [Docker 容器化一键部署](#4-docker-容器化一键部署)
6. [Linux VPS 裸机部署 (Nginx / Caddy 生产配置)](#5-linux-vps-裸机部署)
7. [Vercel 与 GitHub Pages](#6-vercel-与-github-pages)

---

## 环境变量与核心参数

| 变量名称 | 默认值 | 作用说明 |
| :--- | :---: | :--- |
| **`PASSWORD`** | `123456` | **管理员管理密码**。在各平台环境变量或构建参数中设置此变量，即可使用该密码登录并管理文章。 |
| `EXPO_PUBLIC_PASSWORD` | `123456` | 兼容变量名，作用与 `PASSWORD` 一致。 |
| `EXPO_BASE_URL` | 空 | 站点子路径前缀。根域名部署留空；若部署在二级子路径（如 `/blog` 或 GitHub Pages `/repo`），请填写子路径。 |

---

## 1. Cloudflare Pages 部署

### 步骤一：连接 GitHub 自动化构建
1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)，在 **Workers 和 Pages** -> **创建应用程序** -> **Pages** -> **连接到 Git**。
2. 关联仓库并设置构建参数：
   - **构建命令 (Build Command)**：`pnpm build:web`
   - **输出目录 (Build Output Directory)**：`dist`
   - **环境变量**：添加 `PASSWORD=您的专属密码`
3. 点击 **保存并部署**。

### 步骤二：绑定 D1 数据库与 R2 存储桶（云端数据持久化）
1. **创建 D1 数据库**：控制台创建 `blog-db`，并在控制台终端执行：
   ```bash
   pnpm dlx wrangler d1 execute blog-db --file=./migrations/0001_d1_init.sql
   ```
2. **Pages 绑定 D1**：进入 Pages 项目 -> **设置 (Settings)** -> **函数 (Functions)** -> **D1 数据库绑定** -> 变量名填 `DB`，关联 `blog-db`。
3. **Pages 绑定 R2**：创建 R2 存储桶 `blog-bucket`，在函数设置的 **R2 存储桶绑定** 中，变量名填 `BUCKET`，关联 `blog-bucket`。

---

## 2. 腾讯云部署指南

### 方式 A：腾讯云 EdgeOne（边缘安全加速平台 - 推荐）
1. 登录 [腾讯云 EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)。
2. 本地执行导出构建：
   ```bash
   pnpm install
   pnpm build:web
   ```
3. 在 EdgeOne 中新建站点，添加加速域名并选择 **Pages / 静态网站托管**。
4. 将本地生成的 `dist/` 文件夹上传，或通过关联 GitHub 仓库指定构建命令为 `pnpm build:web`、输出目录为 `dist`。
5. 在 EdgeOne 规则引擎中配置全站 HTTPS 与 Brotli/Gzip 压缩，即可享受极速就近访问。

### 方式 B：腾讯云 COS 对象存储静态网站
1. 进入 [腾讯云 COS 控制台](https://console.cloud.tencent.com/cos)，创建公有读存储桶（如 `blog-1250000000`）。
2. 在存储桶基础配置中开启 **静态网站托管**，索引文档填写 `index.html`，404 文档填写 `+not-found.html`。
3. 执行上传命令（可使用腾讯云官方 CLI `coscmd`）：
   ```bash
   coscmd upload -r dist/ /
   ```
4. 将自己的独立域名绑定至腾讯云 CDN 并回源到该 COS 存储桶。

---

## 3. 阿里云部署指南

### 方式 A：阿里云 ESA (Edge Security Acceleration) / 函数计算
1. 登录 [阿里云控制台](https://www.aliyun.com/)，进入 **边缘安全加速 ESA** 或 **云原生应用开发平台 (CAP)**。
2. 配置构建命令 `pnpm build:web`，输出路径指定为 `dist`。
3. 配置自定义域名，开启智能边缘缓存与 HTTP/3 支持。

### 方式 B：阿里云 OSS 对象存储托管
1. 进入 [阿里云 OSS 控制台](https://oss.console.aliyun.com/)，新建 Standard（标准存储）且公共读的 Bucket。
2. 在 Bucket 管理中找到 **数据管理 -> 静态页面**，开启静态页面支持：
   - 默认首页：`index.html`
   - 默认 404 页面：`+not-found.html`
3. 使用 `ossutil` 上传：
   ```bash
   pnpm build:web
   ossutil cp -r dist/ oss://your-bucket-name/ --update
   ```
4. 关联阿里云 CDN 加速域名并开启全站 HTTPS 证书。

---

## 4. Docker 容器化一键部署

项目已优化静态资源服务结构，可通过极简 Docker 镜像运行高性能 Nginx 容器。

### 编写 Dockerfile
在项目根目录创建 `Dockerfile`（已内置优化）：
```dockerfile
# 阶段 1：构建静态产物
FROM node:22-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@9.12.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG PASSWORD=123456
ENV PASSWORD=$PASSWORD
RUN pnpm build:web

# 阶段 2：生产 Nginx 轻量镜像
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 构建与启动容器
```bash
# 构建镜像（可传入自定义管理密码）
docker build --build-arg PASSWORD="mySecret2025" -t blogverse:latest .

# 启动容器并映射到 8080 端口
docker run -d --name my-blog -p 8080:80 --restart=always blogverse:latest
```
访问 `http://服务器IP:8080` 即可秒级开启博客。

---

## 5. Linux VPS 裸机部署

适用于搬瓦工、Linode、DigitalOcean、腾讯云轻量服务器、阿里云 ECS 等所有 Linux VPS。

### 步骤一：在本地或 VPS 构建静态文件
在 VPS 或本地服务器克隆代码并执行：
```bash
git clone <您的仓库地址> blog
cd blog
corepack enable
pnpm install
pnpm build:web
```
此时网站完整静态资源位于 `dist/` 目录。将 `dist/` 复制到服务器标准网站根目录，例如 `/var/www/blogverse`。

### 步骤二：Nginx 配置
创建 Nginx 配置文件 `/etc/nginx/conf.d/blogverse.conf`：
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/blogverse;
    index index.html;

    # 启用 Gzip 深度压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源强缓存提升首屏加载速度
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform, immutable";
    }
}
```
重载 Nginx 并配置 SSL 免费证书：
```bash
nginx -t && systemctl reload nginx
# 使用 Certbot 一键签发 Let's Encrypt HTTPS 证书
certbot --nginx -d yourdomain.com
```

### 步骤三：Caddyfile 极简配置（自动申请 SSL）
如果您使用 Caddy：
```caddy
yourdomain.com {
    root * /var/www/blogverse
    file_server
    try_files {path} {path}/ /index.html
    encode gzip zstd
}
```

---

## 6. Vercel 与 GitHub Pages

- **Vercel**：导入 GitHub 仓库，Build Command 填 `pnpm build:web`，Output Directory 填 `dist`，Environment Variables 添加 `PASSWORD`。
- **GitHub Pages**：进入仓库 **Settings -> Pages**，Source 选择 **GitHub Actions**，工作流 `.github/workflows/pages.yml` 会在推送 `main` 分支时自动部署。
