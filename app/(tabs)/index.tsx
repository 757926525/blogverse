import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ArticleCard, Avatar, BrandMark, TopicPill } from "@/components/blog/blog-ui";
import { topics, type Topic } from "@/lib/blog-data";
import { useBlogStore } from "@/lib/blog-store";

export default function DiscoverScreen() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>("全部");
  const [query, setQuery] = useState("");
  const {
    articles,
    readIds,
    siteName,
    theme,
    currentTimeString,
    currentDateString,
  } = useBlogStore();

  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesTopic = selectedTopic === "全部" || article.topic === selectedTopic;
      const matchesQuery =
        !normalized ||
        `${article.title}${article.excerpt}${article.author.name}${article.topic}`
          .toLowerCase()
          .includes(normalized);
      return matchesTopic && matchesQuery;
    });
  }, [articles, query, selectedTopic]);

  const featured = articles[0];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <BrandMark />
            <View>
              <Text style={[styles.wordmark, { color: theme.primary }]}>{siteName}</Text>
              <Text style={[styles.wordmarkSub, { color: theme.subText }]}>
                {siteName.toUpperCase()} · EDITED DAILY
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.clockBadge, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={[styles.liveDot, { backgroundColor: theme.accent }]} />
              <Text style={[styles.clockBadgeText, { color: theme.text }]}>{currentTimeString}</Text>
            </View>
          </View>
        </View>

        {/* Intro */}
        <View style={styles.introRow}>
          <View style={styles.introCopy}>
            <Text style={[styles.eyebrow, { color: theme.subText }]}>{currentDateString}</Text>
            <Text style={[styles.greeting, { color: theme.text }]}>早上好，沐言。</Text>
            <Text style={[styles.greetingSub, { color: theme.subText }]}>
              留一点时间，给真正想读的内容。
            </Text>
          </View>
          <View
            style={[
              styles.streakCard,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
            ]}
          >
            <Ionicons name="flame" size={19} color="#F77852" />
            <Text style={[styles.streakNumber, { color: theme.text }]}>12</Text>
            <Text style={[styles.streakLabel, { color: theme.subText }]}>日连续阅读</Text>
          </View>
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchWrap,
            { backgroundColor: theme.cardBg, borderColor: theme.border },
          ]}
        >
          <Ionicons name="search-outline" size={20} color={theme.subText} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="搜索文章、作者或专题"
            placeholderTextColor="#9CA5B6"
            style={[styles.searchInput, { color: theme.text }]}
            returnKeyType="search"
          />
          {query ? (
            <Pressable onPress={() => setQuery("")} hitSlop={8} accessibilityLabel="清除搜索">
              <Ionicons name="close-circle" size={18} color="#A9B1C0" />
            </Pressable>
          ) : null}
        </View>

        {/* Continue Reading */}
        {featured ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>继续阅读</Text>
              <Text style={[styles.sectionMeta, { color: theme.subText }]}>
                {readIds.length + 1} 篇在读
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.continueCard,
                { backgroundColor: theme.primary },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`继续阅读：${featured.title}`}
              onPress={() =>
                router.push({ pathname: "/article/[id]", params: { id: featured.id } })
              }
            >
              <View style={[styles.continueAccent, { backgroundColor: theme.accent, opacity: 0.3 }]} />
              <View style={styles.continueContent}>
                <Text style={styles.continueKicker}>LAST READ · 42%</Text>
                <Text style={styles.continueTitle}>{featured.title}</Text>
                <View style={styles.continueFooter}>
                  <View style={styles.continueAuthor}>
                    <Avatar
                      name={featured.author.initials}
                      tone={featured.author.tone}
                      size={24}
                    />
                    <Text style={styles.continueBy}>{featured.author.name}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.continueProgressTrack}>
                <View style={[styles.continueProgressFill, { backgroundColor: theme.accent }]} />
              </View>
            </Pressable>
          </>
        ) : null}

        {/* Topics */}
        <View style={[styles.sectionHeader, styles.topicHeader]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>按专题探索</Text>
          <Text style={[styles.sectionMeta, { color: theme.subText }]}>
            精选 {articles.length} 篇
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicScroll}
        >
          {topics.map((topic) => (
            <TopicPill
              key={topic}
              topic={topic}
              selected={topic === selectedTopic}
              onPress={() => setSelectedTopic(topic)}
            />
          ))}
        </ScrollView>

        {/* Articles List */}
        <View style={[styles.sectionHeader, styles.latestHeader]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {query
              ? "搜索结果"
              : selectedTopic === "全部"
              ? "最新收录"
              : `${selectedTopic}文章`}
          </Text>
          <Text style={[styles.sectionMeta, { color: theme.subText }]}>
            {filteredArticles.length} 篇
          </Text>
        </View>

        {filteredArticles.length ? (
          filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              showProgress={article.id === featured?.id}
            />
          ))
        ) : (
          <View
            style={[
              styles.emptySearch,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
            ]}
          >
            <Ionicons name="search-outline" size={28} color={theme.subText} />
            <Text style={[styles.emptySearchTitle, { color: theme.text }]}>
              还没有找到相关内容
            </Text>
            <Text style={[styles.emptySearchText, { color: theme.subText }]}>
              换一个关键词，或浏览全部专题。
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 36 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  wordmark: { fontSize: 17, fontWeight: "900", letterSpacing: -0.5 },
  wordmarkSub: { fontSize: 8.5, letterSpacing: 1.15, marginTop: 2, fontWeight: "800" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  clockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  clockBadgeText: { fontSize: 11.5, fontWeight: "800" },

  introRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 22 },
  introCopy: { flex: 1, paddingRight: 12 },
  eyebrow: { fontSize: 11, letterSpacing: 0.55, fontWeight: "800", marginBottom: 6 },
  greeting: { fontSize: 27, lineHeight: 34, fontWeight: "900", letterSpacing: -1 },
  greetingSub: { fontSize: 13, marginTop: 5 },
  streakCard: {
    width: 88,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    elevation: 1,
  },
  streakNumber: { fontSize: 18, fontWeight: "900", marginTop: 1 },
  streakLabel: { fontSize: 9.5, fontWeight: "700", marginTop: 1 },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 22,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 15,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, height: "100%" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "900", letterSpacing: -0.35 },
  sectionMeta: { fontSize: 11, fontWeight: "700" },

  continueCard: { minHeight: 142, padding: 18, borderRadius: 21, overflow: "hidden" },
  continueAccent: { position: "absolute", right: -20, top: -46, height: 170, width: 170, borderRadius: 100 },
  continueContent: { zIndex: 1 },
  continueKicker: { color: "#AAB9FF", fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  continueTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    lineHeight: 26,
    fontWeight: "900",
    maxWidth: "80%",
    marginTop: 8,
    letterSpacing: -0.3,
  },
  continueFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  continueAuthor: { flexDirection: "row", alignItems: "center", gap: 7 },
  continueBy: { color: "#DCE4FF", fontSize: 12, fontWeight: "700" },
  continueProgressTrack: {
    position: "absolute",
    left: 18,
    bottom: 11,
    height: 3,
    right: 18,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  continueProgressFill: { width: "42%", height: 3, borderRadius: 99 },

  topicHeader: { marginTop: 26, marginBottom: 10 },
  topicScroll: { paddingRight: 20 },
  latestHeader: { marginTop: 26 },
  emptySearch: {
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 34,
    paddingHorizontal: 18,
    borderWidth: 1,
  },
  emptySearchTitle: { fontWeight: "800", fontSize: 15, marginTop: 10 },
  emptySearchText: { fontSize: 12, marginTop: 5 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
});
