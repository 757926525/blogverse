import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ArticleCard, BrandMark } from "@/components/blog/blog-ui";
import { useBlogStore } from "@/lib/blog-store";

export default function SavedScreen() {
  const { savedIds, articles, theme } = useBlogStore();
  const savedArticles = articles.filter((article) => savedIds.includes(article.id));

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: theme.subText }]}>YOUR LIBRARY</Text>
            <Text style={[styles.title, { color: theme.text }]}>收藏</Text>
          </View>
          <BrandMark compact />
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.accentSoft }]}>
          <View style={[styles.summaryIcon, { backgroundColor: theme.cardBg }]}>
            <Ionicons name="bookmark" size={19} color={theme.accent} />
          </View>
          <View style={styles.summaryCopy}>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>把灵感留在身边</Text>
            <Text style={[styles.summaryText, { color: theme.subText }]}>
              已收藏 {savedArticles.length} 篇文章，随时回来继续读。
            </Text>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: theme.text }]}>已保存的文章</Text>
          <Text style={[styles.count, { color: theme.subText }]}>{savedArticles.length} 篇</Text>
        </View>

        {savedArticles.length ? (
          savedArticles.map((article) => <ArticleCard key={article.id} article={article} />)
        ) : (
          <View style={[styles.empty, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.accentSoft }]}>
              <Ionicons name="bookmark-outline" size={29} color={theme.subText} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>还没有收藏文章</Text>
            <Text style={[styles.emptyText, { color: theme.subText }]}>
              在发现页点按书签，把想重读的内容留在这里。
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 36 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eyebrow: { fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  title: { fontSize: 30, fontWeight: "900", letterSpacing: -1, marginTop: 5 },
  summaryCard: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    borderRadius: 18,
    padding: 15,
  },
  summaryIcon: {
    width: 39,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  summaryCopy: { flex: 1 },
  summaryTitle: { fontWeight: "800", fontSize: 14 },
  summaryText: { fontSize: 12, lineHeight: 18, marginTop: 3 },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 12,
  },
  listTitle: { fontSize: 17, fontWeight: "900" },
  count: { fontSize: 11, fontWeight: "700" },
  empty: {
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 38,
    alignItems: "center",
    borderWidth: 1,
  },
  emptyIcon: {
    height: 58,
    width: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", marginTop: 12 },
  emptyText: { fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 7 },
});
