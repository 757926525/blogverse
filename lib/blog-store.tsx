import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { articles, type Article } from "@/lib/blog-data";

interface BlogStoreValue {
  savedIds: string[];
  likedIds: string[];
  readIds: string[];
  draftSavedAt: string | null;
  toggleSaved: (id: string) => void;
  toggleLiked: (id: string) => void;
  markRead: (id: string) => void;
  saveDraft: () => void;
  getArticle: (id: string) => Article | undefined;
}

const BlogStoreContext = createContext<BlogStoreValue | null>(null);

export function BlogProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>(["good-interface"]);
  const [likedIds, setLikedIds] = useState<string[]>(["quiet-work"]);
  const [readIds, setReadIds] = useState<string[]>(["small-systems"]);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  const value = useMemo<BlogStoreValue>(
    () => ({
      savedIds,
      likedIds,
      readIds,
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
      saveDraft: () => {
        setDraftSavedAt("刚刚");
      },
      getArticle: (id) => articles.find((article) => article.id === id),
    }),
    [draftSavedAt, likedIds, readIds, savedIds],
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
