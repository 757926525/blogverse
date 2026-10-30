# 博客移动应用：实现计划

## 目标

构建一个以移动阅读与随手创作为核心的中文博客应用。产品提供可浏览的精选文章流、专题筛选、文章阅读页、收藏功能、轻量写作器与个人阅读空间；所有核心交互在本地演示数据和 React 状态中可直接使用，不要求登录或外部内容服务。

## 实现方式

- 基于既有 Expo Router、React Native、TypeScript 与 NativeWind starter，在 `app/` 增加四个底部标签页：发现、收藏、创作、我的；新增文章详情路由以保持阅读路径清晰。
- 在 `lib/blog-data.ts` 提供强类型文章、专题及作者演示数据；在 `lib/blog-store.tsx` 提供跨页面的收藏、点赞、搜索词与已读状态。这样内容卡、详情页与书签页共享同一状态，不依赖后端写入。
- 将首页的“继续阅读”、今日精选、专题横向筛选、编辑精选文章卡设计为一条纵向阅读节奏；卡片和详情页均可进入内容阅读。
- 为创作页提供标题、分类、正文输入、实时字数、草稿保存与预览切换；草稿通过 AsyncStorage 本地持久化，并在重进页面后恢复。
- 为个人页提供阅读连续天数、已读篇数、收藏数、主题偏好和最近活动，使其成为个人阅读空间。
- 使用 `@expo/vector-icons` 提供一致的线性图标；只用渐变色块、首字母头像和色彩构图表达文章类型，避免将不相关的占位图片当作内容。
- 配置新的原创品牌图标至 Expo launcher/splash/favicons，并在项目根 `app.config.ts` 填入真实的 HTTPS `logoUrl`。图标等待已请求的原创开放书页标识完成后导入并压缩为各平台所需尺寸。

## 项目结构

```text
app/
  (tabs)/              # 发现、收藏、创作、我的四个主标签页
  article/[id].tsx     # 文章详情与阅读操作
components/blog/       # 可复用的文章卡、标签、阅读进度、品牌标识
lib/blog-data.ts       # 文章、作者、专题演示数据
lib/blog-store.tsx     # 收藏、点赞、搜索、阅读状态的 Context
assets/images/         # 原创移动端图标与启动资源
scripts/               # Web 静态导出与可上传部署包
.github/workflows/     # 可选的 GitHub Pages 构建发布
server/                # 可选 Express/tRPC API
Dockerfile.api         # 独立 Node API 容器入口
.env.example           # 空值环境变量模板，不含真实密钥
README.md              # 项目简介、环境变量与部署说明
wrangler.jsonc         # Cloudflare Pages 项目配置
netlify.toml           # Netlify 构建配置
vercel.json            # Vercel 静态站点配置
eas.json               # Android/iOS EAS 构建配置
```

## 设计方向

### 候选风格

1. **书店手帐**（0.06）：暖纸张、手写批注与独立书签，像实体独立书店的阅读日记。
2. **编辑精选**（0.08，采用）：清晰排版与克制色块，像随身携带的独立媒体编辑台。
3. **夜航阅读器**（0.04）：深色背景、荧光强调与沉静留白，强调深夜长文阅读。

### 采用：编辑精选

- **Design Movement**：数字独立杂志与当代编辑设计，使用有呼吸感的排版代替信息堆叠。
- **Core Principles**：内容优先、单手可达、层级明确、细节克制。每个可点击区域足够宽大，文章标题先于装饰出现。
- **Color Philosophy**：以柔和纸白营造可久读的基底，用墨蓝建立可信赖的内容框架，钴蓝作为动作和进度的专属强调，珊瑚色只用于温度与提醒。
- **Layout Paradigm**：首页是一条从“继续阅读”到“编辑选择”的纵向阅读流，而非居中网格；专题标签横向延展，让拇指沿内容节奏探索。
- **Signature Elements**：章节式序号、带色彩竖线的文章封面、圆角但不厚重的“阅读胶囊”。
- **Interaction Philosophy**：所有内容操作在原位置完成：收藏即时填充、点赞即时计数、读完文章才更新阅读状态；创作页的保存是轻量草稿行为。
- **Animation**：采用 160–220ms 的透明度与缩放过渡，卡片按压轻微收缩，进度条平滑推进；不使用影响阅读的循环运动。
- **Typography System**：中文使用系统无衬线字体保障跨设备可读性；标题采用 700–800 字重，正文 15–17px 等效尺寸与 1.65 倍行距，元信息采用紧凑的中灰字重。
- **Brand Essence**：为愿意慢下来的人整理值得反复阅读的想法。人格：克制、敏锐、温暖。
- **Brand Voice**：短句、邀请式而不催促。示例：“留一点时间，给真正想读的内容。”；“这一页，或许正好回答你。”
- **Wordmark & Logo**：抽象开放书页与对话气泡相融，中央一颗小星代表被保存的灵感；无文字图标在小尺寸仍可识别。
- **Signature Brand Color**：墨蓝纸页（#18233F）与钴蓝（#2E5BFF）的并置。

## 范围说明

本次交付为功能完整的本地内容体验：文章、收藏、阅读进度、草稿与个人数据均为演示数据或本地 React 状态。后续若需要真实账号、多人发布、云端草稿与评论，可以利用已启用的项目服务与数据库将当前数据层替换为 API。

## 部署与仓库交付（新增范围）

- 保持 Manus `origin` 为当前应用的版本检查点仓库；移动项目不支持 canonical GitHub 切换。只有所有者明确授权后，才另建独立私有 GitHub 副本；副本不替换 Manus 主仓库。
- 配置 Expo Web 静态导出命令，默认输出 `dist/`。Cloudflare Pages Git 集成（连接 GitHub 仓库、构建 `pnpm build:web`、发布 `dist`）是首选；同时说明 Dashboard Direct Upload 和 Wrangler CLI 上传，并生成可上传的 ZIP 包。
- 提供 Netlify、Vercel、GitHub Pages 的静态 Web 配置；提供 EAS Android/iOS 原生构建 profile。各平台都说明适用场景、构建设置、路由/子路径限制和可执行步骤，不把静态 UI 部署误称为 Node API 部署。
- README 准确区分客户端公开构建变量与后端运行时秘密；本地演示内容不依赖 API，认证/API 才需要单独部署 Express/tRPC、数据库与 OAuth 环境变量。
