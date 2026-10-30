# 部署指南

“博客”是 Expo Router 应用。本文按产物分为三类：静态 Web 前端、Android/iOS 原生应用，以及可选的 Node API。**Cloudflare Pages Git 集成是静态 Web 的首选方案**：连接 GitHub 仓库后由 Pages 拉取并自动构建。Expo 的静态导出模式会在构建时为路由生成 HTML；项目已将四篇演示文章加入 `generateStaticParams()`，因此对应文章路径也会预渲染。Expo Router 的静态输出、动态路由和服务器模式有不同限制，请不要把静态文件部署当作 SSR 或 API 服务。[6]

## 当前仓库与发布状态

当前主版本仓库由 Manus 管理，且本移动项目不支持把 canonical 主仓库切换为 GitHub。若需 GitHub 副本，须由所有者明确授权创建独立私有仓库；副本不会替换 Manus 主仓库。当前 Manus 自动发布关闭；本指南的 Cloudflare Pages 步骤是可执行的部署方案，但需要所有者把 GitHub 仓库连接到自己的 Cloudflare 账户后才会开始部署。

## 快速选择

- 想从 GitHub 自动拉取并持续部署网站：使用 **Cloudflare Pages → Connect to Git**。
- 想上传一次静态构建包：运行 `pnpm package:web`，在 Cloudflare Pages 新建 Direct Upload 项目，上传 ZIP 或 `dist/` 文件夹。
- 想选其他静态托管：使用 Vercel、Netlify 或 GitHub Pages 的配置和工作流。
- 想生成手机安装包或商店版本：使用 Expo EAS Build / Submit；Pages/Vercel/Netlify 不会生成原生 APK、AAB 或 IPA。
- 想启用登录、tRPC 或数据库：另行部署 `Dockerfile.api` 或运行 Node API 服务。纯演示博客不需要这一步。

## 构建变量和秘密

### 静态 Web / 移动应用客户端构建

如果仅发布仓库内置的演示内容，以下变量都可以留空。

- `EXPO_PUBLIC_API_BASE_URL`：tRPC/API 的服务根地址，例如 `https://api.example.com`；不要附加 `/api/trpc`。Web 登录回调也使用该 API 主机。**它会公开在客户端包中。**
- `MANUS_PROJECT_ID`：OAuth 应用 ID；会映射为客户端 `EXPO_PUBLIC_APP_ID`。旧别名 `VITE_APP_ID` 仍兼容。**它会公开在客户端包中。**
- `MANUS_OAUTH_PORTAL_URL`：登录门户公开 URL；旧别名 `VITE_OAUTH_PORTAL_URL` 仍兼容。**它会公开在客户端包中。**
- `MANUS_OAUTH_API_URL`：OAuth 服务公开 URL；旧别名 `OAUTH_SERVER_URL` 仍兼容。**它会公开在客户端包中。**
- `OWNER_OPEN_ID`、`OWNER_NAME`：应用所需的所有者标识/显示名称；运行时会映射成 `EXPO_PUBLIC_OWNER_OPEN_ID`、`EXPO_PUBLIC_OWNER_NAME`。**它们会公开在客户端包中。**
- `EXPO_BASE_URL`：静态站点部署在域名子路径时的 Expo `experiments.baseUrl`。例如 GitHub Pages 项目站点为 `/blogverse`；域名根目录部署留空。

Expo 约定 `EXPO_PUBLIC_*` 变量会被静态内联到客户端代码，所以它们不是秘密存储区。[14] 不要把任何 API Key、签名密钥、数据库 DSN、服务账号 JSON 或访问令牌放在这些变量里。平台变量通常在项目的 Build/Environment 设置中添加；更改后要重新构建和部署。

### 可选 Node API 服务端运行变量

只有在启用登录、数据库或 tRPC API 时才需要配置这些变量。请通过托管平台的服务器端 Secrets/Environment 设置保存，不要提交实际 `.env` 文件。

- `DATABASE_URL`：MySQL 连接串，数据库功能需要；运行迁移也需要它。不要在浏览器构建变量中填写。
- `MANUS_JWT_SECRET`：服务器会话签名密钥；仅服务端使用。旧别名 `JWT_SECRET` 兼容。
- `MANUS_PROJECT_ID`：OAuth 应用标识，服务端也读取此变量；旧别名 `VITE_APP_ID` 兼容。它是标识，不是秘密。
- `MANUS_OAUTH_API_URL`：OAuth 服务 URL；旧别名 `OAUTH_SERVER_URL` 兼容。
- `OWNER_OPEN_ID`：服务端 owner 标识。
- `ALLOWED_WEB_ORIGINS`：可选 API CORS 白名单，用逗号分隔**精确源**，例如 `https://blog.example.com,https://preview.example.com`。只允许协议、主机和端口完全匹配的来源；不要填写路径或通配符。
- `PORT`：HTTP 监听端口；容器默认 `3000`，云平台设置时以平台注入值为准。
- `BUILT_IN_FORGE_API_URL`、`BUILT_IN_FORGE_API_KEY`：仅当你实际启用模板中对应的 Manus 集成服务时才设置；`API_KEY` 是秘密。

根目录的 [`.env.example`](.env.example) 只含空值模板。首次在某平台配置时复制变量名和值到平台控制台，不要把本地 `.env` 提交。`.gitignore` 已忽略 `.env` 和 `.env.*`，并保留 `.env.example`。

## Cloudflare Pages（首选）

### 方式 A：连接 GitHub 自动拉取部署

1. 先将此项目推送到 GitHub。进入 Cloudflare 控制台的 **Workers & Pages → Create application → Pages → Connect to Git**，授权 GitHub 并选择仓库。[1]
2. 选择生产分支（通常为 `main`），Root directory 留空或 `/`。
3. 构建命令填写 `pnpm build:web`，Build output directory 填 `dist`。仓库的 `.nvmrc` 固定 Node 22，`packageManager` 固定 pnpm 9.12.0；不要换成后端 `pnpm build`。
4. 如要接 API/OAuth，在 Pages 项目 **Settings → Environment variables** 中设置上节的客户端公开变量，再部署一次。Pages 构建配置中 `dist` 是通用静态输出目录示例；本项目已实际验证 Expo 导出到 `dist/`。[3]
5. 点击 **Save and Deploy**。之后生产分支的新提交触发自动拉取、构建和部署；启用的其他分支可以作为预览部署。[1][2]

该仓库包含 `wrangler.jsonc`，声明项目名和 `./dist` 输出目录，可供 Wrangler/Pages 使用。Git 集成与 Direct Upload 是建项目时选择的两种项目类型，**不能把已创建的项目类型直接转换为另一种**。Pages Git 集成项目不能使用仪表盘拖放上传；若要用 Dashboard Direct Upload，请另建一个 Direct Upload Pages 项目。Git 集成项目仍可用 Wrangler 手动上传目录，但手动部署不是模式转换。[2][4]

### 方式 B：一键上传文件/ZIP

在项目根目录执行：

```bash
pnpm install --frozen-lockfile
pnpm package:web
```

命令会先静态导出，再生成：

```text
dist/                         # 网站静态文件夹，包含 index.html 和各路由 HTML
artifacts/blogverse-pages.zip # 同一批 dist 文件的 ZIP，归档根目录就是网站根目录
```

`artifacts/` 和 `dist/` 在 `.gitignore` 中，不会被误提交。如果在 CI 中生成，先从构建工作流下载 `artifacts/blogverse-pages.zip` 文件；如页面只要目录，也可打包/传输整个 `dist/` 文件夹。

要通过 Cloudflare 控制台上传：创建一个 **Direct Upload** 类型 Pages 项目，在 **Workers & Pages → Create application → Get started → Drag and drop your files** 选择项目名，然后把 `artifacts/blogverse-pages.zip` 或 `dist/` 文件夹拖入并部署。Cloudflare Dashboard 支持 ZIP 或文件夹；Direct Upload 每次手动上传时都要重新构建并上传。[2]

也可用 Wrangler 上传同一个 `dist/` 目录。首次使用先登录并创建 Direct Upload 项目：

```bash
pnpm dlx wrangler login
pnpm dlx wrangler pages project create blogverse
pnpm package:web
pnpm dlx wrangler pages deploy dist --project-name=blogverse
```

Wrangler 命令接收文件夹，不接收 ZIP；上传 ZIP 前先解压，或直接用 `dist/`。生产分支以外可用 `--branch=preview` 发布预览。[4] Pages Free 限制包含每个静态文件最大 25 MiB、每个站点最多 20,000 个文件；Dashboard 拖放单次最多 1,000 个文件。本项目当前静态导出远低于该文件数。[5]

## Vercel

项目根部的 [`vercel.json`](vercel.json) 已设置安装命令 `pnpm install --frozen-lockfile`、构建命令 `pnpm build:web` 和输出目录 `dist`。在 Vercel Dashboard 导入 GitHub 仓库，Framework Preset 使用 Other（如自动检测不同，可在 Build & Deployment Settings 覆盖命令与目录），然后部署。Vercel Git 集成可在生产分支提交时创建生产部署，也为其他分支/PR 创建预览部署。[8][9][15]

本项目使用 Expo `web.output: "static"`。静态导出按路由生成 HTML，不需 SPA catch-all rewrite；对动态路径必须在 `generateStaticParams()` 中列出构建时已知参数。若改成 `single` SPA 输出，才按 Expo 指南设置 fallback rewrite；不要把 SPA fallback 盲目加到当前静态多页站点。[6][15]

在 Vercel Project Settings → Environment Variables 添加客户端公开变量。只把本手册标明的非秘密变量用于 Web 构建；更改值后触发新的部署。不要在 `EXPO_PUBLIC_*` 中存储秘密。[10][16][14]

## Netlify

根目录 [`netlify.toml`](netlify.toml) 已设置 Node 22、pnpm 9.12.0、构建命令 `pnpm build:web` 和发布目录 `dist`。在 Netlify 选择 **Add new project → Import an existing project**，连接 GitHub 仓库并部署；后续推送会自动重建。[11][12]

如需连接独立 API，在 Netlify **Project configuration → Environment variables** 设置客户端公开构建变量，并按需选择部署上下文。变量修改后重新构建/部署；不要把服务端 API Key 或数据库密码写入 `EXPO_PUBLIC_*`。[20][14]

手工上传需要先本地执行 `pnpm package:web`，然后用 Netlify 控制台上传预构建的 `dist/` 文件夹，或用 CLI：

```bash
pnpm dlx netlify-cli login
pnpm dlx netlify-cli deploy --dir dist       # 草稿/预览部署
pnpm dlx netlify-cli deploy --dir dist --prod # 生产部署
```

CLI 上传目录不会替你运行构建，所以先执行 `pnpm build:web` 或 `pnpm package:web`。[13] 当前 Expo 输出是 `static`，一般不需要 `/* /index.html 200` 这类 SPA 重写；该规则只适用于改成单页 `single` 输出的应用。[6][12]

## GitHub Pages

仓库提供 [`.github/workflows/pages.yml`](.github/workflows/pages.yml)：在 `main` 推送或手动运行时安装依赖、读取 GitHub Pages 的 base path、执行 `pnpm build:web`、上传 `dist` artifact 并发布。首次使用到仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。[21][22]

工作流将 Pages 提供的路径传入 `EXPO_BASE_URL`。项目站点一般要带 `/<repository-name>`；用户/组织域名根站点或绑定根域名的站点使用空 base path。若你自行改工作流，不要漏掉该变量，否则子路径站点的 JS/CSS 资源会从错误 URL 加载。[7][21][22]

GitHub Pages 是公开静态站点，即使源仓库私有，也不要把敏感内容编译进站点。Actions 只将 `vars.*` 映射给构建步骤；静态页面最终可由访问者下载。不要将 GitHub secrets 注入客户端导出产物。[22][23][24][25][14]

## Expo EAS：Android / iOS 原生应用

[`eas.json`](eas.json) 已提供 Android 内部分发 APK、iOS 模拟器构建与商店生产构建档案。先登录 Expo 并将项目关联到自己的 EAS 项目：

```bash
pnpm dlx eas-cli@latest login
pnpm dlx eas-cli@latest build:configure
```

本项目已有稳定 `android.package`、`ios.bundleIdentifier` 和 app slug；配置时保留这些值，不要在更新版本时更换应用身份。之后可以执行：

```bash
# Android 内测/侧载 APK
pnpm dlx eas-cli@latest build --platform android --profile preview

# iOS 模拟器构建
pnpm dlx eas-cli@latest build --platform ios --profile preview-simulator

# Android AAB + iOS IPA 生产构建
pnpm dlx eas-cli@latest build --platform all --profile production
```

生产构建完成后，如已配置商店凭据：

```bash
pnpm dlx eas-cli@latest submit --platform android --profile production
pnpm dlx eas-cli@latest submit --platform ios --profile production
```

Android Play Store 通常提交 AAB；内测侧载使用 APK。iOS 送 TestFlight/App Store Connect 需要 Apple Developer 账户、签名凭据和 App Store Connect 应用记录；提交二进制不等于已经通过审核或发布。首次 EAS 使用需要按 CLI 提示链接项目并设置 Android keystore、iOS 证书/描述文件和商店凭据；不要将这些凭据提交进仓库。[26][27][28][29][30]

## 可选 Express/tRPC API 部署

静态托管只运行 Web 客户端。它不会运行 `server/` 下的 Node 服务器，也不会自动提供数据库、OAuth callback 或 `/api/trpc`。当前博客示例内容为本地演示数据；若后续启用服务端功能，需要单独部署 Node 22 API 与 MySQL。

本项目提供 [`Dockerfile.api`](Dockerfile.api) 和 `.dockerignore`。支持 Docker 的平台使用：

```bash
docker build -f Dockerfile.api -t blogverse-api .
docker run --rm -p 3000:3000 --env-file .env blogverse-api
```

不用 Docker 的 Node 服务可配置 Build command `pnpm install --frozen-lockfile && pnpm build:api`、Start command `pnpm start`、Health check `/api/health`。服务器监听平台注入的 `PORT`，未提供时使用 `3000`。API 编译输出位于 `server-dist/`，与静态 Web 的 `dist/` 分离。

先为 API 配置数据库和服务器端变量；再把 `EXPO_PUBLIC_API_BASE_URL` 设置为 API 的 HTTPS 根地址。将 Web 站点域名加入 API 的 `ALLOWED_WEB_ORIGINS` 精确白名单。如果浏览器端使用 Cookie 登录，需配置生产 HTTPS 与 OAuth 服务端允许的回调地址。数据库首次初始化/迁移前，先在目标环境配置正确的 `DATABASE_URL`，再运行 `pnpm db:push`；只应在你确认的目标数据库执行。项目环境的开发数据库与生产数据库可能共享数据，请不要把迁移命令当成无害的构建步骤。

## 官方参考

[1]: https://developers.cloudflare.com/pages/get-started/git-integration/ "Cloudflare Pages Git 集成"
[2]: https://developers.cloudflare.com/pages/get-started/direct-upload/ "Cloudflare Pages Direct Upload"
[3]: https://developers.cloudflare.com/pages/configuration/build-configuration/ "Cloudflare Pages 构建配置"
[4]: https://developers.cloudflare.com/workers/wrangler/commands/pages/ "Wrangler Pages 命令"
[5]: https://developers.cloudflare.com/pages/platform/limits/ "Cloudflare Pages 限制"
[6]: https://docs.expo.dev/router/web/static-rendering/ "Expo Router 静态渲染"
[7]: https://docs.expo.dev/versions/latest/config/app/ "Expo App 配置"
[8]: https://vercel.com/docs/git "Vercel Git 部署"
[9]: https://vercel.com/docs/builds/configure-a-build "Vercel 构建设置"
[10]: https://vercel.com/docs/environment-variables "Vercel 环境变量"
[11]: https://docs.netlify.com/start/quickstarts/deploy-from-repository/ "Netlify 导入 Git 仓库"
[12]: https://docs.netlify.com/build/configure-builds/file-based-configuration/ "Netlify 文件化构建配置"
[13]: https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/ "Netlify CLI"
[14]: https://docs.expo.dev/guides/environment-variables/ "Expo 环境变量"
[15]: https://vercel.com/docs/project-configuration/vercel-json "Vercel 项目配置"
[16]: https://vercel.com/docs/environment-variables/managing-environment-variables "Vercel 环境变量管理"
[20]: https://docs.netlify.com/build/environment-variables/get-started/ "Netlify 环境变量"
[21]: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages "GitHub Pages Actions 部署"
[22]: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site "GitHub Pages 发布源配置"
[23]: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits "GitHub Pages 限制"
[24]: https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-variables "GitHub Actions variables"
[25]: https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets "GitHub Actions secrets"
[26]: https://docs.expo.dev/build/introduction/ "Expo EAS Build"
[27]: https://docs.expo.dev/build/eas-json/ "Expo EAS build profiles"
[28]: https://docs.expo.dev/submit/android/ "Expo Android Submit"
[29]: https://docs.expo.dev/submit/ios/ "Expo iOS Submit"
[30]: https://docs.expo.dev/app-signing/security/ "Expo app signing security"
