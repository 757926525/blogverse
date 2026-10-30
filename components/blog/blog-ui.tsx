import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { Article, Topic } from "@/lib/blog-data";
import { useBlogStore } from "@/lib/blog-store";

const ink = "#18233F";
const muted = "#74809B";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Image
      accessibilityLabel="文字星球"
      source={require("@/assets/images/icon.png")}
      style={[styles.brandMark, compact && styles.brandMarkCompact]}
    />
  );
}

export function Avatar({ name, tone, size = 34 }: { name: string; tone: string; size?: number }) {
  return (
    <View style={[styles.avatar, { backgroundColor: tone, width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.42 }]}>{name}</Text>
    </View>
  );
}

export function TopicPill({ topic, selected, onPress }: { topic: Topic; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.topicPill,
        selected ? styles.topicPillActive : styles.topicPillIdle,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.topicText, selected ? styles.topicTextActive : styles.topicTextIdle]}>{topic}</Text>
    </Pressable>
  );
}

export function ArticleCard({ article, showProgress = false }: { article: Article; showProgress?: boolean }) {
  const { savedIds, toggleSaved, readIds } = useBlogStore();
  const isSaved = savedIds.includes(article.id);
  const isRead = readIds.includes(article.id);

  return (
    <View style={styles.articleCard}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`阅读文章：${article.title}`}
        onPress={() => router.push({ pathname: "/article/[id]", params: { id: article.id } })}
        style={({ pressed }) => [styles.articleMain, pressed && styles.cardPressed]}
      >
      <View style={[styles.articleCover, { backgroundColor: article.accentSoft }]}>
        <View style={[styles.coverStripe, { backgroundColor: article.accent }]} />
        <View style={styles.coverTopline}>
          <Text style={[styles.coverIndex, { color: article.accent }]}>{article.coverIndex}</Text>
          <Text style={[styles.coverTopic, { color: article.accent }]}>{article.topic}</Text>
        </View>
        <Ionicons name="arrow-up-outline" size={23} color={article.accent} style={styles.coverArrow} />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardEyebrow}>
          <Text style={[styles.articleTopic, { color: article.accent }]}>{article.topic}</Text>
          {isRead ? <Text style={styles.readTag}>已读</Text> : null}
        </View>
        <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
        <Text style={styles.articleExcerpt} numberOfLines={2}>{article.excerpt}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.authorRow}>
            <Avatar name={article.author.initials} tone={article.author.tone} size={28} />
            <View>
              <Text style={styles.authorName}>{article.author.name}</Text>
              <Text style={styles.articleMeta}>{article.published} · {article.duration}</Text>
            </View>
          </View>
        </View>
        {showProgress ? (
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: "42%", backgroundColor: article.accent }]} />
            </View>
            <Text style={styles.progressText}>已读 42%</Text>
          </View>
        ) : null}
      </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isSaved ? "取消收藏" : "收藏文章"}
        onPress={() => toggleSaved(article.id)}
        hitSlop={8}
        style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
      >
        <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={21} color={isSaved ? article.accent : muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 14,
  },
  brandMarkCompact: { width: 32, height: 32, borderRadius: 11 },
  avatar: { alignItems: "center", justifyContent: "center" },
  avatarText: { color: ink, fontWeight: "800" },
  topicPill: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
  },
  topicPillActive: { backgroundColor: ink, borderColor: ink },
  topicPillIdle: { backgroundColor: "#FFFFFF", borderColor: "#E3E7F0" },
  topicText: { fontSize: 13, fontWeight: "700" },
  topicTextActive: { color: "#FFFFFF" },
  topicTextIdle: { color: "#66718A" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  articleCard: {
    backgroundColor: "#FFFFFF",
    marginBottom: 14,
    borderRadius: 20,
    padding: 12,
    position: "relative",
    shadowColor: "#24304B",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  articleMain: { flexDirection: "row" },
  cardPressed: { transform: [{ scale: 0.985 }], opacity: 0.96 },
  articleCover: {
    width: 96,
    minHeight: 172,
    borderRadius: 15,
    padding: 12,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  coverStripe: { position: "absolute", width: 5, height: "100%", left: 0, top: 0 },
  coverTopline: { gap: 4 },
  coverIndex: { fontSize: 25, lineHeight: 28, fontWeight: "900", letterSpacing: -1 },
  coverTopic: { fontSize: 11, fontWeight: "800" },
  coverArrow: { alignSelf: "flex-end" },
  cardContent: { flex: 1, paddingLeft: 13, justifyContent: "space-between", minWidth: 0 },
  cardEyebrow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 },
  articleTopic: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  readTag: { color: "#71809C", fontSize: 11, fontWeight: "700" },
  articleTitle: { color: ink, fontSize: 16, lineHeight: 22, fontWeight: "800", letterSpacing: -0.2 },
  articleExcerpt: { color: muted, fontSize: 12.5, lineHeight: 19, marginTop: 6 },
  cardFooter: { flexDirection: "row", alignItems: "center", marginTop: 11 },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 7, flexShrink: 1 },
  authorName: { color: ink, fontSize: 12, fontWeight: "700" },
  articleMeta: { color: "#8791A7", fontSize: 10.5, marginTop: 2 },
  saveButton: { position: "absolute", right: 12, bottom: 16, padding: 5 },
  progressRow: { marginTop: 9, gap: 5 },
  progressTrack: { height: 4, borderRadius: 99, backgroundColor: "#EEF1F6", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 99 },
  progressText: { color: "#8C96AA", fontSize: 10.5, fontWeight: "600" },
});
