import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Avatar, BrandMark } from "@/components/blog/blog-ui";
import { useBlogStore } from "@/lib/blog-store";

export function generateStaticParams(): { id: string }[] {
  return [
    { id: "quiet-work" },
    { id: "read-write" },
    { id: "good-interface" },
    { id: "small-systems" },
  ];
}

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getArticle,
    savedIds,
    likedIds,
    readIds,
    toggleSaved,
    toggleLiked,
    markRead,
    deleteArticle,
    isAdmin,
    theme,
  } = useBlogStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const article = getArticle(Array.isArray(id) ? id[0] : id);

  if (!article) {
    return (
      <View style={[styles.missing, { backgroundColor: theme.background }]}>
        <BrandMark />
        <Text style={[styles.missingTitle, { color: theme.text }]}>这篇文章暂时不在这里</Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backToHome, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.backToHomeText}>返回</Text>
        </Pressable>
      </View>
    );
  }

  const isSaved = savedIds.includes(article.id);
  const isLiked = likedIds.includes(article.id);
  const isRead = readIds.includes(article.id);

  const handleDelete = () => {
    deleteArticle(article.id);
    setShowDeleteModal(false);
    router.replace("/(tabs)");
  };

  const handleEdit = () => {
    router.push({ pathname: "/(tabs)/write", params: { editId: article.id } });
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Navigation Bar */}
        <View style={styles.nav}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="返回"
            style={({ pressed }) => [
              styles.navButton,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-back" size={21} color={theme.text} />
          </Pressable>

          <BrandMark compact />

          <View style={styles.navRightActions}>
            {isAdmin ? (
              <>
                <Pressable
                  onPress={handleEdit}
                  accessibilityRole="button"
                  accessibilityLabel="编辑文章"
                  style={({ pressed }) => [
                    styles.navButton,
                    { backgroundColor: theme.cardBg, borderColor: theme.border },
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="create-outline" size={19} color={theme.accent} />
                </Pressable>
                <Pressable
                  onPress={() => setShowDeleteModal(true)}
                  accessibilityRole="button"
                  accessibilityLabel="删除文章"
                  style={({ pressed }) => [
                    styles.navButton,
                    { backgroundColor: "#FFF0F0", borderColor: "#FFE2E2" },
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="trash-outline" size={19} color="#E6675B" />
                </Pressable>
              </>
            ) : null}

            <Pressable
              onPress={() => toggleSaved(article.id)}
              accessibilityRole="button"
              accessibilityLabel={isSaved ? "取消收藏" : "收藏文章"}
              style={({ pressed }) => [
                styles.navButton,
                { backgroundColor: theme.cardBg, borderColor: theme.border },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isSaved ? (article.accent || theme.accent) : theme.text}
              />
            </Pressable>
          </View>
        </View>

        {/* Article Banner or Illustration Gallery */}
        {article.images && article.images.length > 0 ? (
          <View style={styles.galleryWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
              {article.images.map((imgUri, index) => (
                <View key={index} style={styles.galleryItem}>
                  <Image source={{ uri: imgUri }} style={styles.galleryImage} resizeMode="cover" />
                  <View style={styles.imageBadge}>
                    <Text style={styles.imageBadgeText}>{index + 1} / {article.images!.length}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={[styles.articleBanner, { backgroundColor: article.accentSoft || theme.accentSoft }]}>
            <View style={[styles.bannerLine, { backgroundColor: article.accent || theme.accent }]} />
            <Text style={[styles.bannerIndex, { color: article.accent || theme.accent }]}>{article.coverIndex}</Text>
            <Text style={[styles.bannerWord, { color: article.accent || theme.accent }]}>{article.topic.toUpperCase()}</Text>
            <Ionicons name="arrow-up-outline" size={34} color={article.accent || theme.accent} style={styles.bannerArrow} />
          </View>
        )}

        <View style={[styles.topicPill, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.topicText, { color: article.accent || theme.accent }]}>{article.topic}</Text>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>{article.title}</Text>
        <Text style={[styles.excerpt, { color: theme.subText }]}>{article.excerpt}</Text>

        <View style={[styles.authorPanel, { borderColor: theme.border }]}>
          <Avatar name={article.author.initials} tone={article.author.tone} size={42} />
          <View style={styles.authorCopy}>
            <Text style={[styles.authorName, { color: theme.text }]}>{article.author.name}</Text>
            <Text style={[styles.authorRole, { color: theme.subText }]}>{article.author.role} · {article.published}</Text>
          </View>
          <Text style={[styles.duration, { color: theme.subText }]}>{article.duration}</Text>
        </View>

        <View style={styles.readingMeter}>
          <View style={[styles.readingTrack, { backgroundColor: theme.border }]}>
            <View style={[styles.readingFill, { backgroundColor: article.accent || theme.accent }]} />
          </View>
          <Text style={[styles.readingText, { color: theme.subText }]}>阅读进度</Text>
        </View>

        {/* Content sections */}
        <View style={styles.body}>
          {article.sections.map((section, index) => (
            <View key={section.heading} style={styles.section}>
              <View style={styles.sectionHeadingRow}>
                <Text style={[styles.sectionNumber, { color: article.accent || theme.accent }]}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Text style={[styles.sectionHeading, { color: theme.text }]}>{section.heading}</Text>
              </View>
              {section.paragraphs.map((paragraph) => (
                <Text key={paragraph} style={[styles.paragraph, { color: theme.text }]}>
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={[styles.endingCard, { backgroundColor: article.accentSoft || theme.accentSoft }]}>
          <Ionicons name="sparkles" size={20} color={article.accent || theme.accent} />
          <Text style={[styles.endingTitle, { color: theme.text }]}>读到这里，给自己留一句话。</Text>
          <Text style={[styles.endingText, { color: theme.subText }]}>
            好想法不必急着用完，可以先放进心里，慢慢生长。
          </Text>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={() => toggleLiked(article.id)}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
              isLiked && { backgroundColor: "#FFF0EF", borderColor: "#FFD8D4" },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={19}
              color={isLiked ? "#E46257" : theme.subText}
            />
            <Text style={[styles.actionText, { color: isLiked ? "#D85A50" : theme.subText }]}>
              {article.likes + (isLiked ? 1 : 0)}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => toggleSaved(article.id)}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
              isSaved && { backgroundColor: theme.accentSoft, borderColor: theme.accent },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={19}
              color={isSaved ? (article.accent || theme.accent) : theme.subText}
            />
            <Text
              style={[
                styles.actionText,
                { color: isSaved ? (article.accent || theme.accent) : theme.subText },
              ]}
            >
              {isSaved ? "已收藏" : "收藏"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => markRead(article.id)}
            style={({ pressed }) => [
              styles.finishButton,
              { backgroundColor: theme.primary },
              isRead && { backgroundColor: "#E8F6EF" },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={isRead ? "checkmark-circle" : "checkmark"}
              size={18}
              color={isRead ? "#197D66" : "#FFFFFF"}
            />
            <Text style={[styles.finishText, isRead && { color: "#197D66" }]}>
              {isRead ? "已读完" : "读完了"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
            <Ionicons name="alert-circle-outline" size={36} color="#E6675B" style={{ alignSelf: "center", marginBottom: 12 }} />
            <Text style={[styles.modalTitle, { color: theme.text }]}>确认删除文章？</Text>
            <Text style={[styles.modalDesc, { color: theme.subText }]}>
              删除后文章将从全站列表中永久移除，此操作无法撤销。
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                style={[styles.modalCancelBtn, { borderColor: theme.border }]}
              >
                <Text style={{ color: theme.subText, fontWeight: "700" }}>取消</Text>
              </Pressable>
              <Pressable
                onPress={handleDelete}
                style={[styles.modalDeleteBtn, { backgroundColor: "#E6675B" }]}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>确认删除</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 42 },
  nav: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  navRightActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  galleryWrap: { marginTop: 18 },
  galleryScroll: { gap: 12 },
  galleryItem: { position: "relative" },
  galleryImage: { width: 300, height: 180, borderRadius: 20 },
  imageBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  imageBadgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },

  articleBanner: { height: 170, borderRadius: 23, marginTop: 22, padding: 20, overflow: "hidden" },
  bannerLine: { position: "absolute", width: 7, height: "100%", left: 0, top: 0 },
  bannerIndex: { fontSize: 50, lineHeight: 53, fontWeight: "900", letterSpacing: -2 },
  bannerWord: { fontSize: 11, fontWeight: "900", letterSpacing: 1.6, marginTop: 5 },
  bannerArrow: { position: "absolute", bottom: 17, right: 19 },
  topicPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 22,
    borderWidth: 1,
  },
  topicText: { fontSize: 11, fontWeight: "900", letterSpacing: 0.6 },
  title: { fontSize: 30, lineHeight: 40, fontWeight: "900", letterSpacing: -1, marginTop: 14 },
  excerpt: { fontSize: 15.5, lineHeight: 24, marginTop: 12 },
  authorPanel: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  authorCopy: { flex: 1, marginLeft: 10 },
  authorName: { fontSize: 13, fontWeight: "800" },
  authorRole: { fontSize: 11, marginTop: 3 },
  duration: { fontSize: 11, fontWeight: "800" },
  readingMeter: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 16 },
  readingTrack: { flex: 1, height: 4, borderRadius: 99, overflow: "hidden" },
  readingFill: { width: "48%", height: "100%", borderRadius: 99 },
  readingText: { fontSize: 10.5, fontWeight: "700" },
  body: { marginTop: 26 },
  section: { marginBottom: 28 },
  sectionHeadingRow: { flexDirection: "row", alignItems: "baseline", gap: 10, marginBottom: 12 },
  sectionNumber: { fontSize: 11, fontWeight: "900", letterSpacing: 0.5 },
  sectionHeading: { fontSize: 19, fontWeight: "900", letterSpacing: -0.4 },
  paragraph: { fontSize: 16, lineHeight: 28, marginBottom: 14 },
  endingCard: { borderRadius: 19, padding: 18, marginTop: 6 },
  endingTitle: { fontSize: 14, fontWeight: "900", marginTop: 8 },
  endingText: { fontSize: 12.5, lineHeight: 19, marginTop: 5 },
  actions: { flexDirection: "row", gap: 8, marginTop: 24 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    minWidth: 68,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionText: { fontSize: 12, fontWeight: "800" },
  finishButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 42,
    borderRadius: 14,
  },
  finishText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  missing: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  missingTitle: { fontSize: 16, fontWeight: "800" },
  backToHome: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  backToHomeText: { color: "#FFFFFF", fontWeight: "800" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 22,
    padding: 22,
  },
  modalTitle: { fontSize: 18, fontWeight: "900", textAlign: "center" },
  modalDesc: { fontSize: 13, lineHeight: 18, textAlign: "center", marginTop: 8, marginBottom: 20 },
  modalActions: { flexDirection: "row", gap: 10, justifyContent: "center" },
  modalCancelBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  modalDeleteBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
