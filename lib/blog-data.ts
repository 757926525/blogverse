export type Topic = "全部" | "科技" | "工作" | "生活" | "设计";

export interface Author {
  name: string;
  role: string;
  initials: string;
  tone: string;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  topic: Exclude<Topic, "全部">;
  author: Author;
  published: string;
  duration: string;
  readMinutes: number;
  likes: number;
  accent: string;
  accentSoft: string;
  coverIndex: string;
  images?: string[]; // Multiple local illustration Base64 data URLs
  sections: ArticleSection[];
}

export const topics: Topic[] = ["全部", "科技", "工作", "生活", "设计"];

export const articles: Article[] = [
  {
    id: "quiet-work",
    title: "把注意力还给自己：安静工作的练习",
    excerpt: "不是把一天填得更满，而是为真正重要的事留出一段不被打断的时间。",
    topic: "工作",
    author: { name: "林舟", role: "写作与工作方式", initials: "林", tone: "#E9E2FF" },
    published: "今天 08:40",
    duration: "6 分钟",
    readMinutes: 6,
    likes: 284,
    accent: "#4156D8",
    accentSoft: "#E9ECFF",
    coverIndex: "01",
    sections: [
      {
        heading: "先为自己留白",
        paragraphs: [
          "我们常把效率理解成单位时间内完成更多事情。但真正值得完成的工作，往往需要一段不会被消息、会议和待办清单不断切开的时间。",
          "留白不是空闲，也不是奖励。它是一种先于行动的安排：在一天开始之前，先决定哪一段时间不交给别人。",
        ],
      },
      {
        heading: "从一件小事开始",
        paragraphs: [
          "不必一上来就安排两个小时的深度工作。先从二十五分钟开始，关掉提醒，只处理一件需要思考的事。",
          "当注意力回到同一个问题上，思路会慢慢显出层次。你不再只是回应输入，而是在形成自己的判断。",
        ],
      },
      {
        heading: "把结束也变成仪式",
        paragraphs: [
          "结束时写下两行：我推进了什么？下一步最小的动作是什么？这会让下一次开始变得轻松。",
          "安静工作不是逃离协作，而是在协作之前，确保自己依然拥有完整的思考。",
        ],
      },
    ],
  },
  {
    id: "small-systems",
    title: "把生活设计成一套小系统",
    excerpt: "稳定不是靠意志力撑住，而是让好选择在每一天都更容易发生。",
    topic: "生活",
    author: { name: "周末", role: "生活观察者", initials: "周", tone: "#FFE9D9" },
    published: "昨天",
    duration: "5 分钟",
    readMinutes: 5,
    likes: 198,
    accent: "#D9714B",
    accentSoft: "#FFF0E8",
    coverIndex: "02",
    sections: [
      {
        heading: "让环境替你做决定",
        paragraphs: [
          "水果放在看得见的地方，书放在沙发边，手机在工作前离开桌面。环境比意志力更可靠，因为它每天都在重复地提示我们。",
          "真正有效的小系统不是复杂的表格，而是少一点摩擦：把想做的事放近，把不想做的事放远。",
        ],
      },
      {
        heading: "只追踪一件事",
        paragraphs: [
          "同时改掉十个习惯，通常意味着一个也不会留下。选一件最有牵引力的行为，给它一个清晰、可见的标记。",
          "当一次次完成变得可见，稳定感会替代热情，成为继续下去的理由。",
        ],
      },
    ],
  },
  {
    id: "good-interface",
    title: "好界面不是更炫，而是更懂得克制",
    excerpt: "当界面愿意后退一步，用户才能看见自己真正要做的事。",
    topic: "设计",
    author: { name: "许知", role: "产品设计师", initials: "许", tone: "#DFF5ED" },
    published: "10 月 28 日",
    duration: "7 分钟",
    readMinutes: 7,
    likes: 346,
    accent: "#197D66",
    accentSoft: "#E3F7F0",
    coverIndex: "03",
    sections: [
      {
        heading: "每个元素都应该回答一个问题",
        paragraphs: [
          "它帮助用户做什么？如果没有明确答案，元素可能只是为了填满画面。好设计并不害怕留白，因为留白让任务变得清楚。",
          "比起一连串装饰性的动作，用户更在意：下一步在哪里，自己是否做对了，结果会怎样。",
        ],
      },
      {
        heading: "层级是一种礼貌",
        paragraphs: [
          "标题、摘要、操作和辅助信息应当有明确的先后。视觉层级不是炫技，它是在替用户节省判断成本。",
          "当产品愿意少说一点、说清一点，信任就从细节里长出来。",
        ],
      },
    ],
  },
  {
    id: "human-scale-ai",
    title: "AI 时代，重新定义人的尺度",
    excerpt: "工具越快，我们越需要分辨：哪些事应该交给它，哪些判断必须留在自己手里。",
    topic: "科技",
    author: { name: "沈墨", role: "科技编辑", initials: "沈", tone: "#E2EEFF" },
    published: "10 月 26 日",
    duration: "8 分钟",
    readMinutes: 8,
    likes: 512,
    accent: "#2E72B8",
    accentSoft: "#E6F1FF",
    coverIndex: "04",
    sections: [
      {
        heading: "快不是唯一的尺度",
        paragraphs: [
          "新工具擅长把重复工作压缩到极短时间。但人类的价值从来不只在速度，还在于提出好问题、理解复杂语境，并为结果承担责任。",
          "当答案来得很快，提问反而变得更重要。因为问题决定了工具会把我们带向哪里。",
        ],
      },
      {
        heading: "保留判断的肌肉",
        paragraphs: [
          "把琐碎任务交给工具，把关键的比较、取舍和叙述留给自己。每一次有意识的判断，都在训练我们对世界的感受力。",
          "技术不应缩小人的尺度。它应让我们有更多时间，去完成只有人能完成的事情。",
        ],
      },
    ],
  },
  {
    id: "cloudflare-d1-r2-kv-guide",
    title: "Cloudflare D1、R2与KV对接规范、绑定变量说明及扩展指南",
    excerpt: "深入解析无服务器边缘架构：通过 D1 数据库、R2 对象存储与 KV 缓存构建坚固持久的高性能博客数据枢纽。",
    topic: "科技",
    author: { name: "架构团队", role: "系统与云基础设施", initials: "云", tone: "#E0F2FE" },
    published: "精选专栏",
    duration: "10 分钟",
    readMinutes: 10,
    likes: 628,
    accent: "#0284C7",
    accentSoft: "#E0F2FE",
    coverIndex: "05",
    sections: [
      {
        heading: "一、架构总览与边缘选型决策",
        paragraphs: [
          "在现代 Web 与移动博客应用中，纯前端静态应用具备部署敏捷、零服务器成本与全球 CDN 加速的极致体验。然而，当涉及用户自定义头像、文章跨设备漫游、主题配置与多图持久化时，引入轻量 Serverless 存储成为必然演进。",
          "Cloudflare 开发者生态提供了三驾马车：D1（基于 SQLite 的分布式边缘 SQL 数据库）、R2（S3 兼容的高吞吐零出口带宽费对象存储桶）以及 KV（高频超低延迟分布式键值缓存）。本系统设计优先采用 D1 持久化结构化文章与站点配置，搭配 R2 永久托管高分辨率配图，KV 作为超高频读取的灵活备选。",
        ],
      },
      {
        heading: "二、Cloudflare D1 关系型数据库对接规范",
        paragraphs: [
          "1. 数据库创建：登录 Cloudflare Dashboard，在 Workers & Pages -> D1 中创建名称为 blog-db 的数据库。",
          "2. 数据表模式：系统采用规范化结构与 JSON 文档扩展混合模式。表 articles 包含 id, title, topic, excerpt, data_json 与 updated_at 字段；表 site_config 存储全站主题、自定义头像 Base64、全局背景壁纸及偏好设置。",
          "3. 绑定规范：在 Cloudflare Pages 项目的「设置」->「函数」->「D1 数据库绑定」中，变量名必须严格设置为大写 DB，关联数据库选择 blog-db。在服务端代码中即可通过 context.env.DB 顺畅执行预编译 SQL 查询与事务写入。",
        ],
      },
      {
        heading: "三、Cloudflare R2 存储桶图片托管与上传流转",
        paragraphs: [
          "1. 存储桶配置：在 R2 对象存储中创建名为 blog-bucket 的存储桶。在 Pages 项目函数设置中添加 R2 绑定，变量名称严格设置为大写 BUCKET。",
          "2. 上传接口规范：Pages Functions 在 /api/upload 中接收来自文章编辑器或个人中心的图片数据。系统先校验管理员身份标头 x-admin-password，随后将二进制 Buffer 流直接调用 env.BUCKET.put() 存入存储桶，并生成全球可访问的持久化资源 URI。",
          "3. 零成本高吞吐优势：相较于传统 AWS S3 等对象存储，Cloudflare R2 免除了昂贵的数据传出带宽费（Egress Fees），是大型图文博客高频读写的理想托管底座。",
        ],
      },
      {
        heading: "四、Cloudflare KV 轻量级缓存与双模兼容",
        paragraphs: [
          "1. 命名空间绑定：在 Cloudflare KV 控制台创建 BLOG_KV，绑定变量名填写大写 KV。",
          "2. 容灾与极速降级：当生产环境尚未配置 D1 数据库时，系统自动优雅降级到 KV 键值存储模式，将全量文章与站点状态以序列化 JSON 写入 blog:articles 与 blog:config 键中，毫秒级全球边缘就近命中。",
        ],
      },
      {
        heading: "五、环境变量与鉴权变量绑定清单",
        paragraphs: [
          "1. PASSWORD：管理员总控登录口令，未配置时自动使用默认安全口令 123456。无论是静态导出构建还是 Pages Functions 运行时，系统均严密保护并进行统一映射校验。",
          "2. EXPO_PUBLIC_PASSWORD：客户端构建兼容别名，注入前端用于离线密码比对校验。",
          "3. EXPO_BASE_URL：子路径部署参数。域名根目录留空；GitHub Pages 项目站点填写 /<repository-name>。",
        ],
      },
      {
        heading: "六、开发演进与自定义业务扩展指南",
        paragraphs: [
          "本架构代码完全解耦、职责明晰：前端状态在 lib/blog-store.tsx 中统一管理；边缘函数在 functions/api/ 中独立提供接口；数据初始化 SQL 在 migrations/ 目录下版本化追踪。",
          "当您需要扩展评论系统、文章分类标签打分或多作者协作权限时，只需在 0001_d1_init.sql 增加相应数据表，在 /api/ 目录下添加对应的 Pages Function，即可轻松实现全栈无服务器工业级博客系统！",
        ],
      },
    ],
  },
];

export const featuredArticle = articles[2];
