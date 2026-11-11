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
];

export const featuredArticle = articles[2];
