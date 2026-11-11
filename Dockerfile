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
