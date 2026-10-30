import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ArticleCard, BrandMark } from "@/components/blog/blog-ui";
import { articles } from "@/lib/blog-data";
import { useBlogStore } from "@/lib/blog-store";

const ink = "#18233F";

export default function SavedScreen() {
  const { savedIds } = useBlogStore();
  const savedArticles = articles.filter((article) => savedIds.includes(article.id));

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR LIBRARY</Text>
            <Text style={styles.title}>收藏</Text>
          </View>
          <BrandMark compact />
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}><Ionicons name="bookmark" size={19} color="#2E5BFF" /></View>
          <View style={styles.summaryCopy}><Text style={styles.summaryTitle}>把灵感留在身边</Text><Text style={styles.summaryText}>已收藏 {savedArticles.length} 篇文章，随时回来继续读。</Text></View>
        </View>
        <View style={styles.listHeader}><Text style={styles.listTitle}>已保存的文章</Text><Text style={styles.count}>{savedArticles.length} 篇</Text></View>
        {savedArticles.length ? (
          savedArticles.map((article) => <ArticleCard key={article.id} article={article} />)
        ) : (
          <View style={styles.empty}><View style={styles.emptyIcon}><Ionicons name="bookmark-outline" size={29} color="#73809B" /></View><Text style={styles.emptyTitle}>还没有收藏文章</Text><Text style={styles.emptyText}>在发现页点按书签，把想重读的内容留在这里。</Text></View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eyebrow: { color: "#8D97AB", fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  title: { color: ink, fontSize: 30, fontWeight: "900", letterSpacing: -1, marginTop: 5 },
  summaryCard: { marginTop: 24, flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: "#EBF0FF", borderRadius: 18, padding: 15 },
  summaryIcon: { width: 39, height: 39, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#FFFFFF" },
  summaryCopy: { flex: 1 },
  summaryTitle: { color: ink, fontWeight: "800", fontSize: 14 },
  summaryText: { color: "#6A7794", fontSize: 12, lineHeight: 18, marginTop: 3 },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 28, marginBottom: 12 },
  listTitle: { color: ink, fontSize: 17, fontWeight: "900" },
  count: { color: "#8994A9", fontSize: 11, fontWeight: "700" },
  empty: { backgroundColor: "#FFFFFF", borderRadius: 20, paddingHorizontal: 25, paddingVertical: 38, alignItems: "center" },
  emptyIcon: { height: 58, width: 58, borderRadius: 20, backgroundColor: "#F0F3F8", alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: ink, fontSize: 16, fontWeight: "800", marginTop: 12 },
  emptyText: { color: "#7E899E", fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 7 },
});
