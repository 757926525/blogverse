# 博客移动应用

一个以移动阅读和轻量创作为核心的中文博客示例。应用提供发现、收藏、创作和个人四个主入口，包含文章专题筛选、搜索、精选文章、阅读详情、点赞/收藏状态以及本机草稿恢复。内容目前是随仓库交付的演示数据；收藏、点赞、已读与草稿状态保存在本机，不依赖登录或线上内容 API。

## 技术与目录

项目使用 Expo SDK、Expo Router、React Native、TypeScript、NativeWind，并保留可选的 Express/tRPC/Drizzle API starter。`app/` 是移动页面和路由，`lib/blog-data.ts` 保存演示文章，`lib/blog-store.tsx` 管理本地状态，`assets/images/` 保存应用品牌资源。`server/` 与 `drizzle/` 属于可选后端，并不是静态博客演示页的运行前置条件。

## 本地开发

需要 Node.js 22 与 pnpm 9.12.0。推荐用 Corepack 固定包管理器版本：

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Metro/Web 使用端口 `8081`，可选 API 服务使用 `3000`。常用检查命令：

```bash
pnpm check
pnpm lint
pnpm test
pnpm build:web
```

`pnpm build:web` 会将 Expo Router 静态站点导出到 `dist/`。`pnpm package:web` 会构建并生成 `artifacts/blogverse-pages.zip`，适合下载或上传；本地构建产物默认被 Git 忽略。

## 首选部署：Cloudflare Pages

最省事的自动更新方式是将 GitHub 仓库连接到 Cloudflare Pages。每次推送到生产分支后，Pages 自动拉取源码、运行 `pnpm build:web` 并发布 `dist/`。连接步骤、环境变量、静态包获取方式和手动上传命令见[部署指南](DEPLOYMENT.md)。

需要了解 Vercel、Netlify、GitHub Pages、Android/iOS 原生构建或可选 API 部署，请看[多平台部署指南](DEPLOYMENT.md)。

## 配置与安全

纯演示版不需要构建变量。启用登录或独立 API 时，浏览器/应用构建参数与后端运行秘密必须分开设置；所有 `EXPO_PUBLIC_*` 变量都会进入客户端产物，不能放令牌、数据库密码或私钥。安全的占位模板在[`.env.example`](.env.example)，完整用途和平台变量配置见[构建变量说明](DEPLOYMENT.md#构建变量和秘密)。

客户端构建变量：`EXPO_PUBLIC_API_BASE_URL`、`MANUS_PROJECT_ID`、`MANUS_OAUTH_PORTAL_URL`、`MANUS_OAUTH_API_URL`、`OWNER_OPEN_ID`、`OWNER_NAME`、`EXPO_BASE_URL`；除部署路径外，这些值会进入客户端代码。可选 API 服务运行变量：`DATABASE_URL`、`MANUS_JWT_SECRET`、`MANUS_PROJECT_ID`、`MANUS_OAUTH_API_URL`、`OWNER_OPEN_ID`、`ALLOWED_WEB_ORIGINS`、`PORT`、`BUILT_IN_FORGE_API_URL`、`BUILT_IN_FORGE_API_KEY`。数据库 DSN、JWT secret 和 Forge API key 仅放后端密钥配置；完整别名和逐平台设置见部署指南。

## GitHub 仓库

当前项目的主版本仓库仍由 Manus 管理。此移动项目不支持将 canonical 主仓库切换到 GitHub；如需 GitHub 版本，只能在明确授权后另存为私有副本，且副本不会替换 Manus 主仓库。当前自动发布处于关闭状态，推送 Manus 检查点不会自动发布网站；Cloudflare Pages Git 自动部署须由仓库所有者在 Cloudflare 中连接 GitHub 后才会生效。

`dist/` 和生成 ZIP 不提交，因为它们可由固定命令重复构建。请先确认 GitHub 副本的可见性与 GitHub Pages 的公开发布行为，再决定是否启用公开静态站点。
