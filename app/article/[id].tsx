import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, BrandMark } from "@/components/blog/blog-ui";
import { articles } from "@/lib/blog-data";
import { useBlogStore } from "@/lib/blog-store";
const ink = "#18233F";

export function generateStaticParams() {
  return articles.map((article) => ({ id: article.id }));
}

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getArticle, savedIds, likedIds, readIds, toggleSaved, toggleLiked, markRead } = useBlogStore();
  const article = getArticle(Array.isArray(id) ? id[0] : id);

  if (!article) {
    return <View style={styles.missing}><BrandMark /><Text style={styles.missingTitle}>这篇文章暂时不在这里</Text><Pressable onPress={() => router.back()} style={styles.backToHome}><Text style={styles.backToHomeText}>返回</Text></Pressable></View>;
  }

  const isSaved = savedIds.includes(article.id);
  const isLiked = likedIds.includes(article.id);
  const isRead = readIds.includes(article.id);

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.nav}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="返回" style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}><Ionicons name="arrow-back" size={21} color={ink} /></Pressable>
          <BrandMark compact />
          <Pressable onPress={() => toggleSaved(article.id)} accessibilityRole="button" accessibilityLabel={isSaved ? "取消收藏" : "收藏文章"} style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}><Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={20} color={isSaved ? article.accent : ink} /></Pressable>
        </View>

        <View style={[styles.articleBanner, { backgroundColor: article.accentSoft }]}>
          <View style={[styles.bannerLine, { backgroundColor: article.accent }]} />
          <Text style={[styles.bannerIndex, { color: article.accent }]}>{article.coverIndex}</Text>
          <Text style={[styles.bannerWord, { color: article.accent }]}>{article.topic.toUpperCase()}</Text>
          <Ionicons name="arrow-up-outline" size={34} color={article.accent} style={styles.bannerArrow} />
        </View>

        <View style={styles.topicPill}><Text style={[styles.topicText, { color: article.accent }]}>{article.topic}</Text></View>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.excerpt}>{article.excerpt}</Text>

        <View style={styles.authorPanel}>
          <Avatar name={article.author.initials} tone={article.author.tone} size={42} />
          <View style={styles.authorCopy}><Text style={styles.authorName}>{article.author.name}</Text><Text style={styles.authorRole}>{article.author.role} · {article.published}</Text></View>
          <Text style={styles.duration}>{article.duration}</Text>
        </View>

        <View style={styles.readingMeter}><View style={styles.readingTrack}><View style={[styles.readingFill, { backgroundColor: article.accent }]} /></View><Text style={styles.readingText}>阅读进度</Text></View>

        <View style={styles.body}>
          {article.sections.map((section, index) => <View key={section.heading} style={styles.section}><View style={styles.sectionHeadingRow}><Text style={[styles.sectionNumber, { color: article.accent }]}>{String(index + 1).padStart(2, "0")}</Text><Text style={styles.sectionHeading}>{section.heading}</Text></View>{section.paragraphs.map((paragraph) => <Text key={paragraph} style={styles.paragraph}>{paragraph}</Text>)}</View>)}
        </View>

        <View style={[styles.endingCard, { backgroundColor: article.accentSoft }]}><Ionicons name="sparkles" size={20} color={article.accent} /><Text style={styles.endingTitle}>读到这里，给自己留一句话。</Text><Text style={styles.endingText}>好想法不必急着用完，可以先放进心里，慢慢生长。</Text></View>

        <View style={styles.actions}>
          <Pressable onPress={() => toggleLiked(article.id)} style={({ pressed }) => [styles.actionButton, isLiked && { backgroundColor: "#FFF0EF", borderColor: "#FFD8D4" }, pressed && styles.pressed]}><Ionicons name={isLiked ? "heart" : "heart-outline"} size={19} color={isLiked ? "#E46257" : "#69758C"} /><Text style={[styles.actionText, isLiked && { color: "#D85A50" }]}>{article.likes + (isLiked ? 1 : 0)}</Text></Pressable>
          <Pressable onPress={() => toggleSaved(article.id)} style={({ pressed }) => [styles.actionButton, isSaved && { backgroundColor: "#EEF1FF", borderColor: "#DCE4FF" }, pressed && styles.pressed]}><Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={19} color={isSaved ? article.accent : "#69758C"} /><Text style={[styles.actionText, isSaved && { color: article.accent }]}>{isSaved ? "已收藏" : "收藏"}</Text></Pressable>
          <Pressable onPress={() => markRead(article.id)} style={({ pressed }) => [styles.finishButton, isRead && { backgroundColor: "#E8F6EF" }, pressed && styles.pressed]}><Ionicons name={isRead ? "checkmark-circle" : "checkmark"} size={18} color={isRead ? "#197D66" : "#FFFFFF"} /><Text style={[styles.finishText, isRead && { color: "#197D66" }]}>{isRead ? "已读完" : "读完了"}</Text></Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FEFEFF" }, content: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 38 },
  nav: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, navButton: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#F4F6FA" },
  articleBanner: { height: 170, borderRadius: 23, marginTop: 22, padding: 20, overflow: "hidden" }, bannerLine: { position: "absolute", width: 7, height: "100%", left: 0, top: 0 }, bannerIndex: { fontSize: 50, lineHeight: 53, fontWeight: "900", letterSpacing: -2 }, bannerWord: { fontSize: 11, fontWeight: "900", letterSpacing: 1.6, marginTop: 5 }, bannerArrow: { position: "absolute", bottom: 17, right: 19 },
  topicPill: { alignSelf: "flex-start", backgroundColor: "#F1F3F8", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, marginTop: 25 }, topicText: { fontSize: 11, fontWeight: "900", letterSpacing: 0.6 },
  title: { color: ink, fontSize: 31, lineHeight: 41, fontWeight: "900", letterSpacing: -1.1, marginTop: 14 }, excerpt: { color: "#66738C", fontSize: 16, lineHeight: 25, marginTop: 13 },
  authorPanel: { flexDirection: "row", alignItems: "center", marginTop: 23, paddingTop: 17, paddingBottom: 17, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#EAEDF3" }, authorCopy: { flex: 1, marginLeft: 10 }, authorName: { color: ink, fontSize: 13, fontWeight: "800" }, authorRole: { color: "#8791A6", fontSize: 11, marginTop: 3 }, duration: { color: "#5F6D85", fontSize: 11, fontWeight: "800" },
  readingMeter: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 17 }, readingTrack: { flex: 1, height: 4, backgroundColor: "#E8EBF2", borderRadius: 99, overflow: "hidden" }, readingFill: { width: "48%", height: "100%", borderRadius: 99 }, readingText: { color: "#8D97AA", fontSize: 10.5, fontWeight: "700" },
  body: { marginTop: 26 }, section: { marginBottom: 29 }, sectionHeadingRow: { flexDirection: "row", alignItems: "baseline", gap: 10, marginBottom: 12 }, sectionNumber: { fontSize: 11, fontWeight: "900", letterSpacing: 0.5 }, sectionHeading: { color: ink, fontSize: 19, fontWeight: "900", letterSpacing: -0.4 }, paragraph: { color: "#46536B", fontSize: 16, lineHeight: 28, marginBottom: 14 },
  endingCard: { borderRadius: 19, padding: 18, marginTop: 2 }, endingTitle: { color: ink, fontSize: 14, fontWeight: "900", marginTop: 9 }, endingText: { color: "#607088", fontSize: 12.5, lineHeight: 19, marginTop: 5 },
  actions: { flexDirection: "row", gap: 8, marginTop: 24 }, actionButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, minWidth: 68, paddingHorizontal: 12, height: 42, borderRadius: 14, backgroundColor: "#F5F6F9", borderWidth: 1, borderColor: "#ECEEF3" }, actionText: { color: "#657188", fontSize: 12, fontWeight: "800" }, finishButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, height: 42, borderRadius: 14, backgroundColor: ink }, finishText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  missing: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, backgroundColor: "#F7F8FC" }, missingTitle: { color: ink, fontSize: 16, fontWeight: "800" }, backToHome: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: ink }, backToHomeText: { color: "#FFFFFF", fontWeight: "800" }, pressed: { opacity: 0.75, transform: [{ scale: 0.97 }] },
});
