# 完整多平台部署与云端同步指南

本文档提供从基础纯静态托管到全功能云端数据库与存储桶（Cloudflare D1 + R2 + KV）的完整配置指南。

---

## 环境变量总览

| 变量名 | 是否必填 | 默认值 | 详细说明 |
| :--- | :---: | :---: | :--- |
| **`PASSWORD`** | 推荐配置 | `123456` | **管理员管理口令**。配置后登录此密码即可在网页端发布、编辑或删除文章。 |
| `EXPO_PUBLIC_PASSWORD` | 可选 | `123456` | 兼容变量名，效果与 `PASSWORD` 相同。 |
| `EXPO_BASE_URL` | 可选 | 空 | 站点子路径前缀。仅在 GitHub Pages 项目二级路径（如 `/blogverse`）时需要配置。 |

---

## 1. Cloudflare Pages 部署（强烈推荐）

### 步骤一：连接 GitHub 自动化构建部署

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)，在左侧导航栏选择 **Workers 和 Pages** -> **创建应用程序** -> **Pages** -> **连接到 Git**。
2. 授权您的 GitHub 账号并选取本项目仓库。
3. 配置构建选项：
   - **生产分支**：`main`
   - **框架预设**：`None` / `自定义`
   - **构建命令 (Build command)**：`pnpm build:web`
   - **构建输出目录 (Build output directory)**：`dist`
4. 在 **环境变量 (Environment variables)** 中添加：
   - 名称：`PASSWORD`
   - 值：`您的自定义密码`（例如 `admin@2025`）
5. 点击 **保存并部署 (Save and Deploy)**，等待构建完毕即可访问分配的 `*.pages.dev` 域名。

---

### 步骤二：绑定 Cloudflare D1 数据库与 R2 存储桶实现数据同步

项目内置了针对 Cloudflare Pages 的全套 Serverless Functions（位于 `functions/api/`）。只要在 Cloudflare 控制台绑定 D1 和 R2，前端即可一键与云端数据库和存储桶完成数据双向同步。

#### 1. 配置 D1 关系型数据库

1. 在 Cloudflare 控制台左侧进入 **存储与数据库 -> D1 SQL 数据库** -> 点击 **创建数据库**，输入名称 `blog-db`。
2. 初始化数据库结构：
   - 在 D1 控制台的控制台终端（Console）执行如下 SQL，或在本地终端运行：
     ```bash
     pnpm dlx wrangler d1 execute blog-db --file=./migrations/0001_d1_init.sql
     ```
3. 将 D1 绑定到 Pages 项目：
   - 打开您的 Pages 项目 -> **设置 (Settings)** -> **函数 (Functions)** -> **D1 数据库绑定** -> 点击 **添加绑定**：
     - **变量名称**：`DB`（必须大写）
     - **D1 数据库**：选择刚刚创建的 `blog-db`
   - 点击保存。

#### 2. 配置 R2 对象存储桶（用于永久托管图片）

1. 在 Cloudflare 控制台左侧进入 **R2 对象存储** -> 点击 **创建存储桶**，名称填写 `blog-bucket`。
2. 将 R2 绑定到 Pages 项目：
   - 打开您的 Pages 项目 -> **设置 (Settings)** -> **函数 (Functions)** -> **R2 存储桶绑定** -> 点击 **添加绑定**：
     - **变量名称**：`BUCKET`（必须大写）
     - **R2 存储桶**：选择刚刚创建的 `blog-bucket`
   - 点击保存。

#### 3. 配置 KV 命名空间（可选轻量备选）

若不想使用 D1，也可以使用 KV 键值存储：
1. 在控制台左侧创建 KV 命名空间 `BLOG_KV`。
2. 在 Pages 项目的 **设置 -> 函数 -> KV 命名空间绑定** 中添加：
   - **变量名称**：`KV`
   - **KV 命名空间**：选择 `BLOG_KV`

---

## 2. Vercel 部署

1. 在 Vercel 控制台点击 **Add New...** -> **Project** -> 导入本仓库。
2. 配置参数：
   - **Build Command**：`pnpm build:web`
   - **Output Directory**：`dist`
   - **Install Command**：`pnpm install --frozen-lockfile`
3. 在 **Environment Variables** 添加：
   - `PASSWORD`：您的管理员密码（如未设置则默认为 `123456`）
4. 点击 **Deploy** 部署。

---

## 3. GitHub Pages 部署

1. 仓库内已内置工作流文件 `.github/workflows/pages.yml`。
2. 在 GitHub 仓库的 **Settings** -> **Pages** -> **Build and deployment** -> **Source** 选为 **GitHub Actions**。
3. 在 **Settings** -> **Secrets and variables** -> **Actions** -> **Variables** 中可配置：
   - `PASSWORD`：您的管理员密码
4. 推送代码至 `main` 分支后，GitHub Actions 会自动编译并发布。
