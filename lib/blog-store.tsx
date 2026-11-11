import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { articles as initialArticles, type Article, type Topic } from "@/lib/blog-data";
import { THEME_STYLES, TIMEZONES, type ThemeStyle, type TimezoneOption } from "@/lib/theme-presets";

export interface BlogDraft {
  title: string;
  body: string;
  topic: Exclude<Topic, "全部">;
  images: string[];
  savedAt: string;
}

const STORAGE_KEYS = {
  ARTICLES: "blogverse/articles_v2",
  SAVED_IDS: "blogverse/saved_ids_v2",
  LIKED_IDS: "blogverse/liked_ids_v2",
  READ_IDS: "blogverse/read_ids_v2",
  DRAFT: "blogverse/local_draft_v2",
  ADMIN_LOGGED_IN: "blogverse/admin_logged_in_v2",
  ADMIN_PASSWORD: "blogverse/admin_password_v2",
  SITE_NAME: "blogverse/site_name_v2",
  USER_AVATAR: "blogverse/user_avatar_v2",
  CUSTOM_BACKGROUND: "blogverse/custom_background_v2",
  THEME_ID: "blogverse/theme_id_v2",
  TIMEZONE: "blogverse/timezone_v2",
};

interface BlogStoreValue {
  // Articles
  articles: Article[];
  getArticle: (id: string) => Article | undefined;
  createArticle: (article: Omit<Article, "id" | "published" | "duration" | "readMinutes" | "likes" | "coverIndex">) => string;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;

  // Interactivity
  savedIds: string[];
  likedIds: string[];
  readIds: string[];
  toggleSaved: (id: string) => void;
  toggleLiked: (id: string) => void;
  markRead: (id: string) => void;

  // Draft
  draft: BlogDraft | null;
  isDraftLoaded: boolean;
  draftSavedAt: string | null;
  saveDraft: (draft: Pick<BlogDraft, "title" | "body" | "topic" | "images">) => void;
  clearDraft: () => void;

  // Admin Auth
  isAdmin: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  changeAdminPassword: (newPassword: string) => void;

  // Personalization
  siteName: string;
  setSiteName: (name: string) => void;
  userAvatar: string;
  setUserAvatar: (avatar: string) => void;
  customBackground: string | null;
  setCustomBackground: (bg: string | null) => void;

  // Theme Style
  theme: ThemeStyle;
  setThemeId: (id: string) => void;

  // Timezone & Live Network Time
  timezone: string;
  setTimezone: (zone: string) => void;
  currentTimeString: string;
  currentDateString: string;
}

const BlogStoreContext = createContext<BlogStoreValue | null>(null);

const DEFAULT_ADMIN_PASSWORD = process.env.EXPO_PUBLIC_ADMIN_PASSWORD || "admin123";

export function BlogProvider({ children }: { children: ReactNode }) {
  // Articles
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [savedIds, setSavedIds] = useState<string[]>(["good-interface"]);
  const [likedIds, setLikedIds] = useState<string[]>(["quiet-work"]);
  const [readIds, setReadIds] = useState<string[]>(["small-systems"]);

  // Draft
  const [draft, setDraft] = useState<BlogDraft | null>(null);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  // Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState(DEFAULT_ADMIN_PASSWORD);

  // Personalization
  const [siteName, setSiteNameState] = useState("文字星球");
  const [userAvatar, setUserAvatarState] = useState("");
  const [customBackground, setCustomBackgroundState] = useState<string | null>(null);
  const [themeId, setThemeIdState] = useState<string>("classic-ink");
  const [timezone, setTimezoneState] = useState<string>("Asia/Shanghai");

  // Live Time Clock
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Restore stored state
  useEffect(() => {
    const restoreAll = async () => {
      try {
        const [
          savedArticles,
          savedSIds,
          savedLIds,
          savedRIds,
          storedDraft,
          storedAdminLogged,
          storedAdminPwd,
          storedSiteName,
          storedAvatar,
          storedBg,
          storedThemeId,
          storedTz,
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.ARTICLES),
          AsyncStorage.getItem(STORAGE_KEYS.SAVED_IDS),
          AsyncStorage.getItem(STORAGE_KEYS.LIKED_IDS),
          AsyncStorage.getItem(STORAGE_KEYS.READ_IDS),
          AsyncStorage.getItem(STORAGE_KEYS.DRAFT),
          AsyncStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN),
          AsyncStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD),
          AsyncStorage.getItem(STORAGE_KEYS.SITE_NAME),
          AsyncStorage.getItem(STORAGE_KEYS.USER_AVATAR),
          AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_BACKGROUND),
          AsyncStorage.getItem(STORAGE_KEYS.THEME_ID),
          AsyncStorage.getItem(STORAGE_KEYS.TIMEZONE),
        ]);

        if (savedArticles) {
          try {
            const parsed = JSON.parse(savedArticles);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setArticles(parsed);
            }
          } catch {}
        }
        if (savedSIds) {
          try { setSavedIds(JSON.parse(savedSIds)); } catch {}
        }
        if (savedLIds) {
          try { setLikedIds(JSON.parse(savedLIds)); } catch {}
        }
        if (savedRIds) {
          try { setReadIds(JSON.parse(savedRIds)); } catch {}
        }
        if (storedDraft) {
          try {
            const parsed = JSON.parse(storedDraft);
            setDraft({
              title: parsed.title || "",
              body: parsed.body || "",
              topic: parsed.topic || "生活",
              images: Array.isArray(parsed.images) ? parsed.images : [],
              savedAt: parsed.savedAt || "已恢复",
            });
            setDraftSavedAt("已恢复");
          } catch {}
        }
        if (storedAdminLogged === "true") {
          setIsAdmin(true);
        }
        if (storedAdminPwd) {
          setAdminPassword(storedAdminPwd);
        }
        if (storedSiteName) {
          setSiteNameState(storedSiteName);
        }
        if (storedAvatar) {
          setUserAvatarState(storedAvatar);
        }
        if (storedBg) {
          setCustomBackgroundState(storedBg);
        }
        if (storedThemeId) {
          setThemeIdState(storedThemeId);
        }
        if (storedTz) {
          setTimezoneState(storedTz);
        }
      } finally {
        setIsDraftLoaded(true);
      }
    };

    void restoreAll();
  }, []);

  // Format current live time in selected timezone
  const { currentTimeString, currentDateString } = useMemo(() => {
    try {
      const timeFmt = new Intl.DateTimeFormat("zh-CN", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const dateFmt = new Intl.DateTimeFormat("zh-CN", {
        timeZone: timezone,
        weekday: "short",
        month: "long",
        day: "numeric",
      });
      return {
        currentTimeString: timeFmt.format(now),
        currentDateString: dateFmt.format(now),
      };
    } catch {
      return {
        currentTimeString: now.toTimeString().slice(0, 8),
        currentDateString: now.toLocaleDateString(),
      };
    }
  }, [now, timezone]);

  const currentTheme = useMemo(() => {
    const found = THEME_STYLES.find((t) => t.id === themeId);
    return found || THEME_STYLES[0];
  }, [themeId]);

  // Actions
  const createArticle = (newArt: Omit<Article, "id" | "published" | "duration" | "readMinutes" | "likes" | "coverIndex">) => {
    const id = "article-" + Date.now();
    const count = articles.length + 1;
    const coverIndex = String(count).padStart(2, "0");
    const readMinutes = Math.max(1, Math.ceil(newArt.sections.reduce((acc, s) => acc + s.paragraphs.join(" ").length, 0) / 300));
    const article: Article = {
      ...newArt,
      id,
      coverIndex,
      duration: `${readMinutes} 分钟`,
      readMinutes,
      likes: 0,
      published: "刚刚",
    };
    setArticles((prev) => {
      const updated = [article, ...prev];
      void AsyncStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
      return updated;
    });
    return id;
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      void AsyncStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      void AsyncStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
      return updated;
    });
    setSavedIds((prev) => {
      const updated = prev.filter((i) => i !== id);
      void AsyncStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(updated));
      return updated;
    });
  };

  const toggleSaved = (id: string) => {
    setSavedIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      void AsyncStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(next));
      return next;
    });
  };

  const toggleLiked = (id: string) => {
    setLikedIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      void AsyncStorage.setItem(STORAGE_KEYS.LIKED_IDS, JSON.stringify(next));
      return next;
    });
  };

  const markRead = (id: string) => {
    setReadIds((current) => {
      if (current.includes(id)) return current;
      const next = [...current, id];
      void AsyncStorage.setItem(STORAGE_KEYS.READ_IDS, JSON.stringify(next));
      return next;
    });
  };

  const saveDraft = (draftInput: Pick<BlogDraft, "title" | "body" | "topic" | "images">) => {
    const nextDraft: BlogDraft = {
      ...draftInput,
      savedAt: new Date().toLocaleTimeString(),
    };
    setDraft(nextDraft);
    setDraftSavedAt("刚刚");
    void AsyncStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(nextDraft));
  };

  const clearDraft = () => {
    setDraft(null);
    setDraftSavedAt(null);
    void AsyncStorage.removeItem(STORAGE_KEYS.DRAFT);
  };

  const adminLogin = (password: string) => {
    if (password === adminPassword) {
      setIsAdmin(true);
      void AsyncStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, "true");
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    void AsyncStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
  };

  const changeAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
    void AsyncStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
  };

  const setSiteName = (name: string) => {
    setSiteNameState(name);
    void AsyncStorage.setItem(STORAGE_KEYS.SITE_NAME, name);
  };

  const setUserAvatar = (avatar: string) => {
    setUserAvatarState(avatar);
    void AsyncStorage.setItem(STORAGE_KEYS.USER_AVATAR, avatar);
  };

  const setCustomBackground = (bg: string | null) => {
    setCustomBackgroundState(bg);
    if (bg) {
      void AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_BACKGROUND, bg);
    } else {
      void AsyncStorage.removeItem(STORAGE_KEYS.CUSTOM_BACKGROUND);
    }
  };

  const setThemeId = (id: string) => {
    setThemeIdState(id);
    void AsyncStorage.setItem(STORAGE_KEYS.THEME_ID, id);
  };

  const setTimezone = (zone: string) => {
    setTimezoneState(zone);
    void AsyncStorage.setItem(STORAGE_KEYS.TIMEZONE, zone);
  };

  const value = useMemo<BlogStoreValue>(
    () => ({
      articles,
      getArticle: (id) => articles.find((article) => article.id === id),
      createArticle,
      updateArticle,
      deleteArticle,
      savedIds,
      likedIds,
      readIds,
      toggleSaved,
      toggleLiked,
      markRead,
      draft,
      isDraftLoaded,
      draftSavedAt,
      saveDraft,
      clearDraft,
      isAdmin,
      adminLogin,
      adminLogout,
      changeAdminPassword,
      siteName,
      setSiteName,
      userAvatar,
      setUserAvatar,
      customBackground,
      setCustomBackground,
      theme: currentTheme,
      setThemeId,
      timezone,
      setTimezone,
      currentTimeString,
      currentDateString,
    }),
    [
      articles,
      savedIds,
      likedIds,
      readIds,
      draft,
      isDraftLoaded,
      draftSavedAt,
      isAdmin,
      adminPassword,
      siteName,
      userAvatar,
      customBackground,
      currentTheme,
      timezone,
      currentTimeString,
      currentDateString,
    ],
  );

  return <BlogStoreContext.Provider value={value}>{children}</BlogStoreContext.Provider>;
}

export function useBlogStore() {
  const context = useContext(BlogStoreContext);
  if (!context) {
    throw new Error("useBlogStore 必须在 BlogProvider 内使用");
  }
  return context;
}
