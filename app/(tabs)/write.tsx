import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { TopicPill } from "@/components/blog/blog-ui";
import type { Topic } from "@/lib/blog-data";
import { useBlogStore } from "@/lib/blog-store";

const ink = "#18233F";
const writableTopics: Exclude<Topic, "全部">[] = ["工作", "生活", "科技", "设计"];

export default function WriteScreen() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState<Exclude<Topic, "全部">>("生活");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const { saveDraft, draftSavedAt } = useBlogStore();
  const wordCount = useMemo(() => title.trim().length + body.trim().length, [body, title]);

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View><Text style={styles.eyebrow}>NEW NOTE</Text><Text style={styles.title}>写点什么</Text></View>
          <Pressable onPress={saveDraft} accessibilityRole="button" style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
            <Ionicons name="cloud-upload-outline" size={18} color="#2E5BFF" />
            <Text style={styles.saveText}>保存草稿</Text>
          </Pressable>
        </View>
        <Text style={styles.helper}>灵感不需要完整，先写下它出现的那一刻。</Text>

        <View style={styles.modeSwitch}>
          <Pressable onPress={() => setMode("edit")} style={[styles.modeButton, mode === "edit" && styles.modeButtonActive]}><Text style={[styles.modeText, mode === "edit" && styles.modeTextActive]}>编辑</Text></Pressable>
          <Pressable onPress={() => setMode("preview")} style={[styles.modeButton, mode === "preview" && styles.modeButtonActive]}><Text style={[styles.modeText, mode === "preview" && styles.modeTextActive]}>预览</Text></Pressable>
        </View>

        {mode === "edit" ? (
          <View style={styles.editorCard}>
            <TextInput value={title} onChangeText={setTitle} placeholder="给这篇文章一个标题" placeholderTextColor="#A1A9B8" style={styles.titleInput} multiline maxLength={52} />
            <View style={styles.separator} />
            <Text style={styles.fieldLabel}>选择专题</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topics}>
              {writableTopics.map((item) => <TopicPill key={item} topic={item} selected={topic === item} onPress={() => setTopic(item)} />)}
            </ScrollView>
            <TextInput value={body} onChangeText={setBody} placeholder="从一个真切的瞬间开始……" placeholderTextColor="#A1A9B8" style={styles.bodyInput} multiline textAlignVertical="top" maxLength={3000} />
            <View style={styles.editorFooter}><Text style={styles.wordCount}>{wordCount} 字</Text><Text style={styles.editorHint}>自动保存在本地</Text></View>
          </View>
        ) : (
          <View style={styles.previewCard}>
            <View style={styles.previewTopic}><Text style={styles.previewTopicText}>{topic}</Text></View>
            <Text style={styles.previewTitle}>{title || "你的标题会出现在这里"}</Text>
            <Text style={styles.previewAuthor}>沐言 · 刚刚</Text>
            <View style={styles.previewLine} />
            <Text style={[styles.previewBody, !body && styles.previewBodyMuted]}>{body || "开始写作后，可以在这里预览文章的阅读节奏。"}</Text>
          </View>
        )}

        <View style={styles.tipCard}><Ionicons name="bulb-outline" size={20} color="#D9714B" /><View style={styles.tipCopy}><Text style={styles.tipTitle}>写作提示</Text><Text style={styles.tipText}>试着回答：我最近反复想到的，究竟是什么？</Text></View></View>
        {draftSavedAt ? <Text style={styles.savedToast}>草稿已保存 · {draftSavedAt}</Text> : null}
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
  helper: { color: "#778299", fontSize: 13, marginTop: 10 },
  saveButton: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: "#EAF0FF", borderRadius: 12 },
  saveText: { color: "#2E5BFF", fontSize: 12, fontWeight: "800" },
  modeSwitch: { flexDirection: "row", gap: 4, alignSelf: "flex-start", marginTop: 24, backgroundColor: "#E9ECF3", borderRadius: 12, padding: 3 },
  modeButton: { paddingVertical: 8, paddingHorizontal: 17, borderRadius: 9 },
  modeButtonActive: { backgroundColor: "#FFFFFF", shadowColor: "#22304E", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 1 },
  modeText: { fontSize: 12, fontWeight: "800", color: "#7A859A" },
  modeTextActive: { color: ink },
  editorCard: { marginTop: 16, backgroundColor: "#FFFFFF", borderRadius: 21, padding: 18, minHeight: 440 },
  titleInput: { color: ink, fontSize: 23, lineHeight: 31, fontWeight: "900", letterSpacing: -0.6, minHeight: 60 },
  separator: { height: 1, backgroundColor: "#EAEDF3", marginVertical: 16 },
  fieldLabel: { color: "#7C879B", fontSize: 11, fontWeight: "900", letterSpacing: 0.5 },
  topics: { paddingTop: 10, paddingBottom: 13 },
  bodyInput: { color: "#3B4761", fontSize: 15, lineHeight: 25, minHeight: 180, paddingTop: 5 },
  editorFooter: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#EDF0F5", paddingTop: 12 },
  wordCount: { color: "#8993A6", fontSize: 11, fontWeight: "700" },
  editorHint: { color: "#9EA7B8", fontSize: 11 },
  previewCard: { marginTop: 16, backgroundColor: "#FFFFFF", borderRadius: 21, padding: 22, minHeight: 360 },
  previewTopic: { alignSelf: "flex-start", backgroundColor: "#EDF0FF", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  previewTopicText: { color: "#4156D8", fontSize: 11, fontWeight: "900" },
  previewTitle: { color: ink, fontSize: 26, lineHeight: 35, fontWeight: "900", letterSpacing: -0.8, marginTop: 18 },
  previewAuthor: { color: "#8A95A9", fontSize: 12, marginTop: 12 },
  previewLine: { height: 1, backgroundColor: "#E7EBF2", marginVertical: 20 },
  previewBody: { color: "#425069", fontSize: 15, lineHeight: 26 },
  previewBodyMuted: { color: "#A3ABBA" },
  tipCard: { flexDirection: "row", gap: 10, alignItems: "flex-start", marginTop: 18, backgroundColor: "#FFF3EB", padding: 15, borderRadius: 17 },
  tipCopy: { flex: 1 },
  tipTitle: { color: "#9C563B", fontSize: 12, fontWeight: "900" },
  tipText: { color: "#A66B52", fontSize: 12, lineHeight: 18, marginTop: 3 },
  savedToast: { color: "#2E5BFF", textAlign: "center", fontSize: 12, fontWeight: "800", marginTop: 13 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
