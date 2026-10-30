import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ArticleCard, Avatar, BrandMark, TopicPill } from "@/components/blog/blog-ui";
import { articles, featuredArticle, topics, type Topic } from "@/lib/blog-data";
import { useBlogStore } from "@/lib/blog-store";

const ink = "#18233F";

export default function DiscoverScreen() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>("全部");
  const [query, setQuery] = useState("");
  const { readIds } = useBlogStore();

  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesTopic = selectedTopic === "全部" || article.topic === selectedTopic;
      const matchesQuery = !normalized || `${article.title}${article.excerpt}${article.author.name}${article.topic}`.toLowerCase().includes(normalized);
      return matchesTopic && matchesQuery;
    });
  }, [query, selectedTopic]);

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <BrandMark />
            <View>
              <Text style={styles.wordmark}>文字星球</Text>
              <Text style={styles.wordmarkSub}>BLOGVERSE · EDITED DAILY</Text>
            </View>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="通知" style={({ pressed }) => [styles.iconCircle, pressed && styles.pressed]}>
            <Ionicons name="notifications-outline" size={21} color={ink} />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        <View style={styles.introRow}>
          <View style={styles.introCopy}>
            <Text style={styles.eyebrow}>周五 · 10 月 30 日</Text>
            <Text style={styles.greeting}>早上好，沐言。</Text>
            <Text style={styles.greetingSub}>留一点时间，给真正想读的内容。</Text>
          </View>
          <View style={styles.streakCard}>
            <Ionicons name="flame" size={19} color="#F77852" />
            <Text style={styles.streakNumber}>12</Text>
            <Text style={styles.streakLabel}>日连续阅读</Text>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={20} color="#8D97AB" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="搜索文章、作者或专题"
            placeholderTextColor="#9CA5B6"
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query ? (
            <Pressable onPress={() => setQuery("")} hitSlop={8} accessibilityLabel="清除搜索">
              <Ionicons name="close-circle" size={18} color="#A9B1C0" />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>继续阅读</Text>
          <Text style={styles.sectionMeta}>{readIds.length + 1} 篇在读</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.continueCard, pressed && styles.pressed]} accessibilityRole="button">
          <View style={styles.continueAccent} />
          <View style={styles.continueContent}>
            <Text style={styles.continueKicker}>LAST READ · 42%</Text>
            <Text style={styles.continueTitle}>{articles[0].title}</Text>
            <View style={styles.continueFooter}>
              <View style={styles.continueAuthor}>
                <Avatar name={articles[0].author.initials} tone={articles[0].author.tone} size={24} />
                <Text style={styles.continueBy}>{articles[0].author.name}</Text>
              </View>
              <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.continueProgressTrack}><View style={styles.continueProgressFill} /></View>
        </Pressable>

        <View style={[styles.sectionHeader, styles.topicHeader]}>
          <Text style={styles.sectionTitle}>按专题探索</Text>
          <Text style={styles.sectionMeta}>精选 {articles.length} 篇</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topicScroll}>
          {topics.map((topic) => <TopicPill key={topic} topic={topic} selected={topic === selectedTopic} onPress={() => setSelectedTopic(topic)} />)}
        </ScrollView>

        {!query && selectedTopic === "全部" ? (
          <>
            <View style={[styles.sectionHeader, styles.featuredHeader]}>
              <Text style={styles.sectionTitle}>编辑精选</Text>
              <Text style={styles.sectionMeta}>本周推荐</Text>
            </View>
            <View style={[styles.featuredCard, { backgroundColor: featuredArticle.accent }]}> 
              <View style={styles.featuredTopRow}>
                <View style={styles.featuredPill}><Text style={styles.featuredPillText}>FEATURED</Text></View>
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.featuredTitle}>{featuredArticle.title}</Text>
              <Text style={styles.featuredExcerpt}>{featuredArticle.excerpt}</Text>
              <View style={styles.featuredBottom}>
                <View style={styles.featuredAuthor}><Avatar name={featuredArticle.author.initials} tone="#FFFFFF44" size={27} /><Text style={styles.featuredAuthorText}>{featuredArticle.author.name} · {featuredArticle.duration}</Text></View>
                <Text style={styles.featuredArrow}>↗</Text>
              </View>
            </View>
          </>
        ) : null}

        <View style={[styles.sectionHeader, styles.latestHeader]}>
          <Text style={styles.sectionTitle}>{query ? "搜索结果" : selectedTopic === "全部" ? "最新收录" : `${selectedTopic}文章`}</Text>
          <Text style={styles.sectionMeta}>{filteredArticles.length} 篇</Text>
        </View>
        {filteredArticles.length ? (
          filteredArticles.map((article) => <ArticleCard key={article.id} article={article} showProgress={article.id === articles[0].id} />)
        ) : (
          <View style={styles.emptySearch}><Ionicons name="search-outline" size={28} color="#9AA5B8" /><Text style={styles.emptySearchTitle}>还没有找到相关内容</Text><Text style={styles.emptySearchText}>换一个关键词，或浏览全部专题。</Text></View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  wordmark: { color: ink, fontSize: 17, fontWeight: "900", letterSpacing: -0.5 },
  wordmarkSub: { color: "#8B95A9", fontSize: 8.5, letterSpacing: 1.15, marginTop: 2, fontWeight: "800" },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#ECEEF5" },
  notificationDot: { position: "absolute", width: 7, height: 7, borderRadius: 99, backgroundColor: "#FF725E", top: 9, right: 9, borderWidth: 1.5, borderColor: "#FFFFFF" },
  introRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 24 },
  introCopy: { flex: 1, paddingRight: 12 },
  eyebrow: { color: "#8B95A8", fontSize: 11, letterSpacing: 0.55, fontWeight: "800", marginBottom: 6 },
  greeting: { color: ink, fontSize: 27, lineHeight: 34, fontWeight: "900", letterSpacing: -1 },
  greetingSub: { color: "#6F7B91", fontSize: 13, marginTop: 5 },
  streakCard: { backgroundColor: "#FFFFFF", width: 88, paddingVertical: 10, alignItems: "center", borderRadius: 18, shadowColor: "#1F2A44", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  streakNumber: { color: ink, fontSize: 18, fontWeight: "900", marginTop: 1 },
  streakLabel: { color: "#8791A6", fontSize: 9.5, fontWeight: "700", marginTop: 1 },
  searchWrap: { flexDirection: "row", alignItems: "center", gap: 9, marginTop: 24, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#EAEDF4", paddingHorizontal: 14, height: 48, borderRadius: 15 },
  searchInput: { flex: 1, color: ink, fontSize: 14, height: "100%" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 28, marginBottom: 12 },
  sectionTitle: { color: ink, fontSize: 18, fontWeight: "900", letterSpacing: -0.35 },
  sectionMeta: { color: "#8C96A9", fontSize: 11, fontWeight: "700" },
  continueCard: { backgroundColor: ink, minHeight: 142, padding: 18, borderRadius: 21, overflow: "hidden" },
  continueAccent: { position: "absolute", right: -20, top: -46, height: 170, width: 170, borderRadius: 100, backgroundColor: "#304377" },
  continueContent: { zIndex: 1 },
  continueKicker: { color: "#AAB9FF", fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  continueTitle: { color: "#FFFFFF", fontSize: 19, lineHeight: 26, fontWeight: "900", maxWidth: "80%", marginTop: 8, letterSpacing: -0.3 },
  continueFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  continueAuthor: { flexDirection: "row", alignItems: "center", gap: 7 },
  continueBy: { color: "#DCE4FF", fontSize: 12, fontWeight: "700" },
  continueProgressTrack: { position: "absolute", left: 18, bottom: 11, height: 3, right: 18, borderRadius: 99, backgroundColor: "#5C6EAA" },
  continueProgressFill: { width: "42%", height: 3, borderRadius: 99, backgroundColor: "#AAB9FF" },
  topicHeader: { marginTop: 27, marginBottom: 10 },
  topicScroll: { paddingRight: 20 },
  featuredHeader: { marginTop: 29 },
  featuredCard: { borderRadius: 22, padding: 19, minHeight: 210, overflow: "hidden" },
  featuredTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  featuredPill: { backgroundColor: "#FFFFFF24", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: "#FFFFFF3D" },
  featuredPillText: { color: "#FFFFFF", fontSize: 9, letterSpacing: 0.8, fontWeight: "900" },
  featuredTitle: { color: "#FFFFFF", fontSize: 23, lineHeight: 31, fontWeight: "900", letterSpacing: -0.7, marginTop: 25, maxWidth: "93%" },
  featuredExcerpt: { color: "#E7EAFF", fontSize: 13, lineHeight: 19, marginTop: 8, maxWidth: "92%" },
  featuredBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 18 },
  featuredAuthor: { flexDirection: "row", alignItems: "center", gap: 8 },
  featuredAuthorText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  featuredArrow: { color: "#FFFFFF", fontSize: 24, fontWeight: "500" },
  latestHeader: { marginTop: 28 },
  emptySearch: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 20, paddingVertical: 34, paddingHorizontal: 18 },
  emptySearchTitle: { color: ink, fontWeight: "800", fontSize: 15, marginTop: 10 },
  emptySearchText: { color: "#8E98AB", fontSize: 12, marginTop: 5 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
});
