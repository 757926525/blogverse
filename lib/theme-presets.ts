export interface ThemeStyle {
  id: string;
  name: string;
  primary: string; // Key brand / ink color
  accent: string;  // Main action / highlight color
  accentSoft: string; // Soft container / tag color
  background: string; // Page background
  cardBg: string; // Card background
  text: string;
  subText: string;
  border: string;
}

export const THEME_STYLES: ThemeStyle[] = [
  {
    id: "classic-ink",
    name: "墨蓝经典",
    primary: "#18233F",
    accent: "#2E5BFF",
    accentSoft: "#EAF0FF",
    background: "#F7F8FC",
    cardBg: "#FFFFFF",
    text: "#18233F",
    subText: "#6F7B91",
    border: "#EAEDF4",
  },
  {
    id: "warm-paper",
    name: "纸砚雅致",
    primary: "#2C2621",
    accent: "#C36B3B",
    accentSoft: "#FCEFE6",
    background: "#F9F6F0",
    cardBg: "#FFFFFF",
    text: "#2C2621",
    subText: "#7E7369",
    border: "#ECE4DA",
  },
  {
    id: "twilight-dark",
    name: "暮光深邃",
    primary: "#E2E8F0",
    accent: "#60A5FA",
    accentSoft: "#1E293B",
    background: "#0F172A",
    cardBg: "#1E293B",
    text: "#F8FAFC",
    subText: "#94A3B8",
    border: "#334155",
  },
  {
    id: "emerald-bamboo",
    name: "翡翠清竹",
    primary: "#064E3B",
    accent: "#059669",
    accentSoft: "#ECFDF5",
    background: "#F2FBF7",
    cardBg: "#FFFFFF",
    text: "#064E3B",
    subText: "#477E6E",
    border: "#D1FAE5",
  },
  {
    id: "coral-dawn",
    name: "珊瑚朝阳",
    primary: "#2A1816",
    accent: "#F43F5E",
    accentSoft: "#FFF1F2",
    background: "#FFF8F8",
    cardBg: "#FFFFFF",
    text: "#2A1816",
    subText: "#885957",
    border: "#FFE4E6",
  },
  {
    id: "lavender-mist",
    name: "薰衣草紫",
    primary: "#2E1065",
    accent: "#7C3AED",
    accentSoft: "#F5F3FF",
    background: "#FAF8FF",
    cardBg: "#FFFFFF",
    text: "#2E1065",
    subText: "#6D538A",
    border: "#EDE9FE",
  },
  {
    id: "cyber-neon",
    name: "赛博霓虹",
    primary: "#0F172A",
    accent: "#06B6D4",
    accentSoft: "#ECFEFF",
    background: "#F0F9FF",
    cardBg: "#FFFFFF",
    text: "#0C4A6E",
    subText: "#4E7794",
    border: "#CFFAFE",
  },
  {
    id: "amber-autumn",
    name: "琥珀秋叶",
    primary: "#451A03",
    accent: "#D97706",
    accentSoft: "#FFFBEB",
    background: "#FFFDF5",
    cardBg: "#FFFFFF",
    text: "#451A03",
    subText: "#8C6A4B",
    border: "#FEF3C7",
  },
  {
    id: "minimal-mono",
    name: "极简黑白",
    primary: "#000000",
    accent: "#374151",
    accentSoft: "#F3F4F6",
    background: "#FAFAFA",
    cardBg: "#FFFFFF",
    text: "#111827",
    subText: "#6B7280",
    border: "#E5E7EB",
  },
  {
    id: "ocean-azure",
    name: "碧蓝海洋",
    primary: "#082F49",
    accent: "#0284C7",
    accentSoft: "#E0F2FE",
    background: "#F0F7FD",
    cardBg: "#FFFFFF",
    text: "#082F49",
    subText: "#476A85",
    border: "#BAE6FD",
  },
];

export interface TimezoneOption {
  label: string;
  zone: string;
  offset: string;
}

export const TIMEZONES: TimezoneOption[] = [
  { label: "北京时间 (UTC+8)", zone: "Asia/Shanghai", offset: "+08:00" },
  { label: "东京时间 (UTC+9)", zone: "Asia/Tokyo", offset: "+09:00" },
  { label: "新加坡 (UTC+8)", zone: "Asia/Singapore", offset: "+08:00" },
  { label: "伦敦时间 (UTC+0)", zone: "Europe/London", offset: "+00:00" },
  { label: "巴黎/柏林 (UTC+1)", zone: "Europe/Paris", offset: "+01:00" },
  { label: "纽约时间 (UTC-5)", zone: "America/New_York", offset: "-05:00" },
  { label: "洛杉矶时间 (UTC-8)", zone: "America/Los_Angeles", offset: "-08:00" },
  { label: "悉尼时间 (UTC+11)", zone: "Australia/Sydney", offset: "+11:00" },
];
