import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { TopicPill } from "@/components/blog/blog-ui";
import { type Topic } from "@/lib/blog-data";
import { useBlogStore, type BlogDraft } from "@/lib/blog-store";
import { pickLocalImages } from "@/lib/image-picker";

const writableTopics: Exclude<Topic, "全部">[] = ["工作", "生活", "科技", "设计"];

export default function WriteScreen() {
  const { draft, isDraftLoaded, getArticle, isAdmin } = useBlogStore();
  const params = useLocalSearchParams<{ editId?: string }>();
  const editId = params.editId;

  if (!isDraftLoaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>正在恢复草稿…</Text>
      </View>
    );
  }

  const editingArticle = editId ? getArticle(editId) : undefined;

  return (
    <WriteEditor
      key={editId ? `edit-${editId}` : (draft?.savedAt ?? "new-draft")}
      initialDraft={draft}
      editingArticle={editingArticle}
      isAdmin={isAdmin}
    />
  );
}

function WriteEditor({
  initialDraft,
  editingArticle,
  isAdmin,
}: {
  initialDraft: BlogDraft | null;
  editingArticle?: any;
  isAdmin: boolean;
}) {
  const { saveDraft, clearDraft, draftSavedAt, createArticle, updateArticle, theme } = useBlogStore();

  const isEditing = !!editingArticle;

  const [title, setTitle] = useState(
    isEditing ? editingArticle.title : (initialDraft?.title ?? ""),
  );
  const [body, setBody] = useState(
    isEditing
      ? editingArticle.sections.map((s: any) => `${s.heading}\n${s.paragraphs.join("\n")}`).join("\n\n")
      : (initialDraft?.body ?? ""),
  );
  const [topic, setTopic] = useState<Exclude<Topic, "全部">>(
    isEditing ? editingArticle.topic : (initialDraft?.topic ?? "生活"),
  );
  const [images, setImages] = useState<string[]>(
    isEditing ? (editingArticle.images || []) : (initialDraft?.images || []),
  );
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [publishToast, setPublishToast] = useState("");

  const wordCount = useMemo(() => title.trim().length + body.trim().length, [body, title]);

  const handlePickImages = async () => {
    const picked = await pickLocalImages(true);
    if (picked.length > 0) {
      setImages((prev) => [...prev, ...picked]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!title.trim()) {
      setPublishToast("请填写文章标题");
      return;
    }
    if (!body.trim()) {
      setPublishToast("请填写文章正文");
      return;
    }

    // Split body into sections
    const rawParagraphs = body.split("\n\n").filter(Boolean);
    const sections = rawParagraphs.map((paraBlock: string, idx: number) => {
      const lines = paraBlock.split("\n").filter(Boolean);
      const heading = lines.length > 1 ? lines[0] : (idx === 0 ? "核心思考" : `思考小节 ${idx + 1}`);
      const paragraphs = lines.length > 1 ? lines.slice(1) : lines;
      return { heading, paragraphs };
    });

    if (isEditing) {
      updateArticle(editingArticle.id, {
        title: title.trim(),
        topic,
        excerpt: body.slice(0, 90).replace(/\n/g, " ") + "…",
        images,
        sections,
      });
      setPublishToast("文章已更新！");
      setTimeout(() => {
        router.replace({ pathname: "/article/[id]", params: { id: editingArticle.id } });
      }, 800);
    } else {
      const id = createArticle({
        title: title.trim(),
        topic,
        excerpt: body.slice(0, 90).replace(/\n/g, " ") + "…",
        author: {
          name: "沐言",
          role: "创作者",
          initials: "沐",
          tone: theme.accentSoft,
        },
        accent: theme.accent,
        accentSoft: theme.accentSoft,
        images,
        sections,
      });
      clearDraft();
      setPublishToast("文章已发布！");
      setTimeout(() => {
        router.replace({ pathname: "/article/[id]", params: { id } });
      }, 800);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: theme.subText }]}>
              {isEditing ? "EDITING ARTICLE" : "NEW NOTE"}
            </Text>
            <Text style={[styles.title, { color: theme.text }]}>
              {isEditing ? "编辑文章" : "写点什么"}
            </Text>
          </View>
          <View style={styles.headerActions}>
            {!isEditing ? (
              <Pressable
                onPress={() => saveDraft({ title, body, topic, images })}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.saveButton,
                  { backgroundColor: theme.accentSoft },
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="cloud-upload-outline" size={17} color={theme.accent} />
                <Text style={[styles.saveText, { color: theme.accent }]}>保存草稿</Text>
              </Pressable>
            ) : null}

            {isAdmin ? (
              <Pressable
                onPress={handlePublish}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.publishButton,
                  { backgroundColor: theme.primary },
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="paper-plane-outline" size={17} color="#FFFFFF" />
                <Text style={styles.publishText}>{isEditing ? "更新发布" : "发布文章"}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {!isAdmin ? (
          <View style={[styles.adminNotice, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Ionicons name="information-circle-outline" size={18} color={theme.accent} />
            <Text style={[styles.adminNoticeText, { color: theme.subText }]}>
              当前为普通访客模式。如需发布或修改文章，请前往「我的」在设置区进行管理员登录。
            </Text>
          </View>
        ) : null}

        <View style={[styles.modeSwitch, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Pressable
            onPress={() => setMode("edit")}
            style={[styles.modeButton, mode === "edit" && { backgroundColor: theme.primary }]}
          >
            <Text style={[styles.modeText, { color: mode === "edit" ? "#FFFFFF" : theme.subText }]}>
              编辑
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("preview")}
            style={[styles.modeButton, mode === "preview" && { backgroundColor: theme.primary }]}
          >
            <Text style={[styles.modeText, { color: mode === "preview" ? "#FFFFFF" : theme.subText }]}>
              预览
            </Text>
          </Pressable>
        </View>

        {mode === "edit" ? (
          <View style={[styles.editorCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="给这篇文章一个标题"
              placeholderTextColor="#A1A9B8"
              style={[styles.titleInput, { color: theme.text }]}
              multiline
              maxLength={64}
            />
            <View style={[styles.separator, { backgroundColor: theme.border }]} />

            <Text style={[styles.fieldLabel, { color: theme.subText }]}>选择专题</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topics}>
              {writableTopics.map((item) => (
                <TopicPill
                  key={item}
                  topic={item}
                  selected={topic === item}
                  onPress={() => setTopic(item)}
                />
              ))}
            </ScrollView>

            {/* Multiple Local Images Upload */}
            <View style={styles.imageSection}>
              <View style={styles.imageSectionHeader}>
                <Text style={[styles.fieldLabel, { color: theme.subText }]}>
                  文章配图 ({images.length} 张)
                </Text>
                <Pressable
                  onPress={handlePickImages}
                  style={[styles.addImgBtn, { backgroundColor: theme.accentSoft }]}
                >
                  <Ionicons name="images-outline" size={15} color={theme.accent} />
                  <Text style={[styles.addImgText, { color: theme.accent }]}>选择本地配图</Text>
                </Pressable>
              </View>

              {images.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageList}>
                  {images.map((imgUri, index) => (
                    <View key={index} style={styles.imageThumbWrap}>
                      <Image source={{ uri: imgUri }} style={styles.imageThumb} />
                      <Pressable
                        onPress={() => handleRemoveImage(index)}
                        style={styles.imageDeleteBtn}
                      >
                        <Ionicons name="close" size={14} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              ) : null}
            </View>

            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="从一个真切的瞬间开始……（段落之间空一行将自动划分为小节）"
              placeholderTextColor="#A1A9B8"
              style={[styles.bodyInput, { color: theme.text }]}
              multiline
              textAlignVertical="top"
              maxLength={5000}
            />

            <View style={[styles.editorFooter, { borderTopColor: theme.border }]}>
              <Text style={[styles.wordCount, { color: theme.subText }]}>{wordCount} 字</Text>
              <Text style={[styles.editorHint, { color: theme.subText }]}>
                {isAdmin ? "管理员可直接点击右上角发布" : "已自动为您保护草稿"}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.previewCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <View style={[styles.previewTopic, { backgroundColor: theme.accentSoft }]}>
              <Text style={[styles.previewTopicText, { color: theme.accent }]}>{topic}</Text>
            </View>
            <Text style={[styles.previewTitle, { color: theme.text }]}>
              {title || "你的标题会出现在这里"}
            </Text>
            <Text style={[styles.previewAuthor, { color: theme.subText }]}>沐言 · 刚刚</Text>

            {images.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewImages}>
                {images.map((img, i) => (
                  <Image key={i} source={{ uri: img }} style={styles.previewImageItem} />
                ))}
              </ScrollView>
            ) : null}

            <View style={[styles.previewLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.previewBody, { color: theme.text }, !body && styles.previewBodyMuted]}>
              {body || "开始写作后，可以在这里预览文章的阅读节奏。"}
            </Text>
          </View>
        )}

        {publishToast ? (
          <Text style={[styles.savedToast, { color: theme.accent }]}>{publishToast}</Text>
        ) : draftSavedAt && !isEditing ? (
          <Text style={[styles.savedToast, { color: theme.accent }]}>
            草稿已保存 · {draftSavedAt}
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { color: "#7E899E", fontSize: 13, fontWeight: "700" },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: { fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  title: { fontSize: 30, fontWeight: "900", letterSpacing: -1, marginTop: 5 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  saveText: { fontSize: 12, fontWeight: "800" },
  publishButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  publishText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },

  adminNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
  },
  adminNoticeText: { flex: 1, fontSize: 12, lineHeight: 17 },

  modeSwitch: {
    flexDirection: "row",
    gap: 4,
    alignSelf: "flex-start",
    marginTop: 18,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  modeButton: { paddingVertical: 7, paddingHorizontal: 16, borderRadius: 9 },
  modeText: { fontSize: 12, fontWeight: "800" },

  editorCard: {
    marginTop: 16,
    borderRadius: 22,
    padding: 18,
    minHeight: 460,
    borderWidth: 1,
  },
  titleInput: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "900",
    letterSpacing: -0.6,
    minHeight: 50,
  },
  separator: { height: 1, marginVertical: 14 },
  fieldLabel: { fontSize: 11, fontWeight: "900", letterSpacing: 0.5 },
  topics: { paddingTop: 10, paddingBottom: 13 },

  imageSection: { marginVertical: 10 },
  imageSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  addImgBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addImgText: { fontSize: 11.5, fontWeight: "800" },
  imageList: { flexDirection: "row", gap: 10, paddingVertical: 6 },
  imageThumbWrap: { position: "relative" },
  imageThumb: { width: 80, height: 80, borderRadius: 12 },
  imageDeleteBtn: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(0,0,0,0.75)",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  bodyInput: {
    fontSize: 15,
    lineHeight: 25,
    minHeight: 200,
    paddingTop: 8,
  },
  editorFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 14,
  },
  wordCount: { fontSize: 11, fontWeight: "700" },
  editorHint: { fontSize: 11 },

  previewCard: {
    marginTop: 16,
    borderRadius: 22,
    padding: 22,
    minHeight: 360,
    borderWidth: 1,
  },
  previewTopic: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  previewTopicText: { fontSize: 11, fontWeight: "900" },
  previewTitle: {
    fontSize: 26,
    lineHeight: 35,
    fontWeight: "900",
    letterSpacing: -0.8,
    marginTop: 16,
  },
  previewAuthor: { fontSize: 12, marginTop: 10 },
  previewImages: { flexDirection: "row", gap: 10, marginTop: 16 },
  previewImageItem: { width: 140, height: 100, borderRadius: 12 },
  previewLine: { height: 1, marginVertical: 18 },
  previewBody: { fontSize: 15, lineHeight: 26 },
  previewBodyMuted: { color: "#A3ABBA" },

  savedToast: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 14,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
