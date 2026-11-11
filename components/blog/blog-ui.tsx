import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { Article, Topic } from "@/lib/blog-data";
import { useBlogStore } from "@/lib/blog-store";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const { userAvatar } = useBlogStore();

  if (userAvatar) {
    return (
      <Image
        accessibilityLabel="个人头像"
        source={{ uri: userAvatar }}
        style={[styles.brandMark, compact && styles.brandMarkCompact]}
      />
    );
  }

  return (
    <Image
      accessibilityLabel="文字星球"
      source={require("@/assets/images/icon.png")}
      style={[styles.brandMark, compact && styles.brandMarkCompact]}
    />
  );
}

export function Avatar({ name, tone, size = 34 }: { name: string; tone: string; size?: number }) {
  const { theme } = useBlogStore();
  return (
    <View style={[styles.avatar, { backgroundColor: tone, width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.42, color: theme.text }]}>{name}</Text>
    </View>
  );
}

export function TopicPill({ topic, selected, onPress }: { topic: Topic; selected: boolean; onPress: () => void }) {
  const { theme } = useBlogStore();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.topicPill,
        {
          backgroundColor: selected ? theme.primary : theme.cardBg,
          borderColor: selected ? theme.primary : theme.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.topicText, { color: selected ? "#FFFFFF" : theme.subText }]}>{topic}</Text>
    </Pressable>
  );
}

export function ArticleCard({ article, showProgress = false }: { article: Article; showProgress?: boolean }) {
  const { savedIds, toggleSaved, readIds, theme } = useBlogStore();
  const isSaved = savedIds.includes(article.id);
  const isRead = readIds.includes(article.id);

  const hasCustomImages = article.images && article.images.length > 0;

  return (
    <View style={[styles.articleCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`阅读文章：${article.title}`}
        onPress={() => router.push({ pathname: "/article/[id]", params: { id: article.id } })}
        style={({ pressed }) => [styles.articleMain, pressed && styles.cardPressed]}
      >
        {hasCustomImages ? (
          <View style={styles.articleCover}>
            <Image source={{ uri: article.images![0] }} style={styles.coverImage} resizeMode="cover" />
            <View style={[styles.coverStripe, { backgroundColor: article.accent || theme.accent }]} />
            <View style={styles.coverImageBadge}>
              <Text style={styles.coverImageBadgeText}>
                {article.images!.length > 1 ? `${article.images!.length} 图` : "配图"}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.articleCover, { backgroundColor: article.accentSoft || theme.accentSoft }]}>
            <View style={[styles.coverStripe, { backgroundColor: article.accent || theme.accent }]} />
            <View style={styles.coverTopline}>
              <Text style={[styles.coverIndex, { color: article.accent || theme.accent }]}>{article.coverIndex}</Text>
              <Text style={[styles.coverTopic, { color: article.accent || theme.accent }]}>{article.topic}</Text>
            </View>
            <Ionicons name="arrow-up-outline" size={23} color={article.accent || theme.accent} style={styles.coverArrow} />
          </View>
        )}

        <View style={styles.cardContent}>
          <View style={styles.cardEyebrow}>
            <Text style={[styles.articleTopic, { color: article.accent || theme.accent }]}>{article.topic}</Text>
            {isRead ? <Text style={[styles.readTag, { color: theme.subText }]}>已读</Text> : null}
          </View>
          <Text style={[styles.articleTitle, { color: theme.text }]} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={[styles.articleExcerpt, { color: theme.subText }]} numberOfLines={2}>
            {article.excerpt}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.authorRow}>
              <Avatar name={article.author.initials} tone={article.author.tone} size={28} />
              <View>
                <Text style={[styles.authorName, { color: theme.text }]}>{article.author.name}</Text>
                <Text style={[styles.articleMeta, { color: theme.subText }]}>
                  {article.published} · {article.duration}
                </Text>
              </View>
            </View>
          </View>
          {showProgress ? (
            <View style={styles.progressRow}>
              <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                <View style={[styles.progressFill, { width: "42%", backgroundColor: article.accent || theme.accent }]} />
              </View>
              <Text style={[styles.progressText, { color: theme.subText }]}>已读 42%</Text>
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
        <Ionicons
          name={isSaved ? "bookmark" : "bookmark-outline"}
          size={21}
          color={isSaved ? (article.accent || theme.accent) : theme.subText}
        />
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
  avatarText: { fontWeight: "800" },
  topicPill: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
  },
  topicText: { fontSize: 13, fontWeight: "700" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  articleCard: {
    marginBottom: 14,
    borderRadius: 20,
    padding: 12,
    position: "relative",
    borderWidth: 1,
    elevation: 1,
  },
  articleMain: { flexDirection: "row" },
  cardPressed: { transform: [{ scale: 0.985 }], opacity: 0.96 },
  articleCover: {
    width: 96,
    minHeight: 160,
    borderRadius: 15,
    padding: 12,
    overflow: "hidden",
    justifyContent: "space-between",
    position: "relative",
  },
  coverImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
  },
  coverImageBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  coverImageBadgeText: { color: "#FFFFFF", fontSize: 9.5, fontWeight: "800" },
  coverStripe: { position: "absolute", width: 5, height: "100%", left: 0, top: 0 },
  coverTopline: { gap: 4 },
  coverIndex: { fontSize: 25, lineHeight: 28, fontWeight: "900", letterSpacing: -1 },
  coverTopic: { fontSize: 11, fontWeight: "800" },
  coverArrow: { alignSelf: "flex-end" },
  cardContent: { flex: 1, paddingLeft: 13, justifyContent: "space-between", minWidth: 0 },
  cardEyebrow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 },
  articleTopic: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  readTag: { fontSize: 11, fontWeight: "700" },
  articleTitle: { fontSize: 16, lineHeight: 22, fontWeight: "800", letterSpacing: -0.2 },
  articleExcerpt: { fontSize: 12.5, lineHeight: 19, marginTop: 6 },
  cardFooter: { flexDirection: "row", alignItems: "center", marginTop: 11 },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 7, flexShrink: 1 },
  authorName: { fontSize: 12, fontWeight: "700" },
  articleMeta: { fontSize: 10.5, marginTop: 2 },
  saveButton: { position: "absolute", right: 12, bottom: 16, padding: 5 },
  progressRow: { marginTop: 9, gap: 5 },
  progressTrack: { height: 4, borderRadius: 99, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 99 },
  progressText: { fontSize: 10.5, fontWeight: "600" },
});
