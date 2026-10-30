import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { articles, type Article, type Topic } from "@/lib/blog-data";

export interface BlogDraft {
  title: string;
  body: string;
  topic: Exclude<Topic, "全部">;
  savedAt: string;
}

const DRAFT_STORAGE_KEY = "blogverse/local-draft";

interface BlogStoreValue {
  savedIds: string[];
  likedIds: string[];
  readIds: string[];
  draft: BlogDraft | null;
  isDraftLoaded: boolean;
  draftSavedAt: string | null;
  toggleSaved: (id: string) => void;
  toggleLiked: (id: string) => void;
  markRead: (id: string) => void;
  saveDraft: (draft: Pick<BlogDraft, "title" | "body" | "topic">) => void;
  getArticle: (id: string) => Article | undefined;
}

const BlogStoreContext = createContext<BlogStoreValue | null>(null);

export function BlogProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>(["good-interface"]);
  const [likedIds, setLikedIds] = useState<string[]>(["quiet-work"]);
  const [readIds, setReadIds] = useState<string[]>(["small-systems"]);
  const [draft, setDraft] = useState<BlogDraft | null>(null);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const restoreDraft = async () => {
      try {
        const storedDraft = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
        if (!storedDraft) return;
        const parsed = JSON.parse(storedDraft) as Partial<BlogDraft>;
        if (typeof parsed.title === "string" && typeof parsed.body === "string" && typeof parsed.topic === "string") {
          setDraft({
            title: parsed.title,
            body: parsed.body,
            topic: parsed.topic as Exclude<Topic, "全部">,
            savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : "已恢复",
          });
          setDraftSavedAt("已恢复");
        }
      } finally {
        setIsDraftLoaded(true);
      }
    };

    void restoreDraft();
  }, []);

  const value = useMemo<BlogStoreValue>(
    () => ({
      savedIds,
      likedIds,
      readIds,
      draft,
      isDraftLoaded,
      draftSavedAt,
      toggleSaved: (id) => {
        setSavedIds((current) =>
          current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
        );
      },
      toggleLiked: (id) => {
        setLikedIds((current) =>
          current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
        );
      },
      markRead: (id) => {
        setReadIds((current) => (current.includes(id) ? current : [...current, id]));
      },
      saveDraft: ({ title, body, topic }) => {
        const nextDraft: BlogDraft = { title, body, topic, savedAt: new Date().toISOString() };
        setDraft(nextDraft);
        setDraftSavedAt("刚刚");
        void AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(nextDraft));
      },
      getArticle: (id) => articles.find((article) => article.id === id),
    }),
    [draft, draftSavedAt, isDraftLoaded, likedIds, readIds, savedIds],
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
