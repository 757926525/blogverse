import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Avatar, BrandMark } from "@/components/blog/blog-ui";
import { useBlogStore } from "@/lib/blog-store";

const ink = "#18233F";

export default function ProfileScreen() {
  const { savedIds, readIds, likedIds } = useBlogStore();
  const stats = [
    { value: "12", label: "连续阅读" },
    { value: String(readIds.length + 16), label: "已读文章" },
    { value: String(savedIds.length), label: "已收藏" },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topRow}><Text style={styles.eyebrow}>MY SPACE</Text><BrandMark compact /></View>
        <View style={styles.profileRow}>
          <Avatar name="沐" tone="#DCE5FF" size={64} />
          <View style={styles.profileCopy}><Text style={styles.name}>沐言</Text><Text style={styles.handle}>@muyan · 正在阅读与记录</Text><View style={styles.memberPill}><Ionicons name="sparkles" size={12} color="#4156D8" /><Text style={styles.memberText}>第 3 年阅读者</Text></View></View>
          <Pressable accessibilityRole="button" accessibilityLabel="编辑资料" style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}><Ionicons name="pencil-outline" size={18} color={ink} /></Pressable>
        </View>

        <View style={styles.statCard}>
          {stats.map((stat, index) => <View key={stat.label} style={[styles.statItem, index < stats.length - 1 && styles.statDivider]}><Text style={styles.statValue}>{stat.value}</Text><Text style={styles.statLabel}>{stat.label}</Text></View>)}
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>本周阅读节奏</Text><Text style={styles.sectionMeta}>很不错</Text></View>
        <View style={styles.weekCard}>
          <View style={styles.weekTop}><View><Text style={styles.weekValue}>4.5 小时</Text><Text style={styles.weekText}>比上周多读了 38 分钟</Text></View><View style={styles.chartBadge}><Ionicons name="trending-up" size={19} color="#FFFFFF" /></View></View>
          <View style={styles.bars}>{[0.38, 0.72, 0.51, 0.9, 0.6, 0.32, 0.76].map((height, i) => <View key={i} style={styles.barWrap}><View style={[styles.bar, { height: `${height * 100}%`, backgroundColor: i === 3 ? "#2E5BFF" : "#C9D4FF" }]} /><Text style={styles.day}>{["一", "二", "三", "四", "五", "六", "日"][i]}</Text></View>)}</View>
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>主题偏好</Text><Text style={styles.sectionMeta}>最近 30 天</Text></View>
        <View style={styles.preferenceCard}>
          <Preference icon="briefcase-outline" title="工作与思考" percentage="46%" color="#4156D8" width="46%" />
          <Preference icon="leaf-outline" title="生活与关系" percentage="31%" color="#D9714B" width="31%" />
          <Preference icon="color-palette-outline" title="设计观察" percentage="23%" color="#197D66" width="23%" />
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>最近活动</Text><Text style={styles.sectionMeta}>{likedIds.length} 个喜欢</Text></View>
        <View style={styles.activityCard}>
          <Activity icon="bookmark" color="#2E5BFF" text="收藏了《好界面不是更炫，而是更懂得克制》" time="今天" />
          <Activity icon="heart" color="#E6675B" text="喜欢了《把注意力还给自己》" time="昨天" last />
        </View>
      </ScrollView>
    </View>
  );
}

function Preference({ icon, title, percentage, color, width }: { icon: keyof typeof Ionicons.glyphMap; title: string; percentage: string; color: string; width: `${number}%` }) {
  return <View style={styles.preferenceRow}><View style={[styles.preferenceIcon, { backgroundColor: `${color}18` }]}><Ionicons name={icon} size={17} color={color} /></View><View style={styles.preferenceCopy}><View style={styles.preferenceTop}><Text style={styles.preferenceTitle}>{title}</Text><Text style={[styles.percentage, { color }]}>{percentage}</Text></View><View style={styles.preferenceTrack}><View style={[styles.preferenceFill, { width, backgroundColor: color }]} /></View></View></View>;
}

function Activity({ icon, color, text, time, last = false }: { icon: keyof typeof Ionicons.glyphMap; color: string; text: string; time: string; last?: boolean }) {
  return <View style={[styles.activityRow, !last && styles.activityBorder]}><View style={[styles.activityIcon, { backgroundColor: `${color}17` }]}><Ionicons name={icon} size={16} color={color} /></View><View style={styles.activityCopy}><Text style={styles.activityText}>{text}</Text><Text style={styles.activityTime}>{time}</Text></View></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" }, content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, eyebrow: { color: "#8D97AB", fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  profileRow: { flexDirection: "row", alignItems: "center", marginTop: 19 }, profileCopy: { flex: 1, marginLeft: 12 }, name: { color: ink, fontSize: 24, fontWeight: "900", letterSpacing: -0.6 }, handle: { color: "#778299", fontSize: 12, marginTop: 3 },
  memberPill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#ECF0FF", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, marginTop: 7 }, memberText: { color: "#5265BC", fontSize: 10, fontWeight: "800" },
  editButton: { width: 37, height: 37, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E9ECF2" },
  statCard: { flexDirection: "row", backgroundColor: "#FFFFFF", borderRadius: 20, paddingVertical: 17, marginTop: 23, shadowColor: "#27334D", shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 }, statItem: { flex: 1, alignItems: "center" }, statDivider: { borderRightWidth: 1, borderRightColor: "#EDF0F5" }, statValue: { color: ink, fontSize: 19, fontWeight: "900" }, statLabel: { color: "#8791A6", fontSize: 10.5, fontWeight: "700", marginTop: 3 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 28, marginBottom: 12 }, sectionTitle: { color: ink, fontSize: 17, fontWeight: "900" }, sectionMeta: { color: "#8A94A8", fontSize: 11, fontWeight: "700" },
  weekCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 17 }, weekTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }, weekValue: { color: ink, fontSize: 21, fontWeight: "900" }, weekText: { color: "#7F8A9F", fontSize: 11.5, marginTop: 4 }, chartBadge: { width: 35, height: 35, backgroundColor: "#4156D8", borderRadius: 13, alignItems: "center", justifyContent: "center" }, bars: { height: 76, marginTop: 14, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }, barWrap: { height: "100%", width: 19, alignItems: "center", justifyContent: "flex-end" }, bar: { width: 11, borderRadius: 99 }, day: { color: "#98A1B1", fontSize: 10, marginTop: 6 },
  preferenceCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16, gap: 16 }, preferenceRow: { flexDirection: "row", alignItems: "center", gap: 10 }, preferenceIcon: { width: 33, height: 33, borderRadius: 12, alignItems: "center", justifyContent: "center" }, preferenceCopy: { flex: 1 }, preferenceTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 7 }, preferenceTitle: { color: "#536077", fontSize: 12, fontWeight: "700" }, percentage: { fontSize: 11, fontWeight: "900" }, preferenceTrack: { height: 5, backgroundColor: "#EDF0F5", borderRadius: 99, overflow: "hidden" }, preferenceFill: { height: "100%", borderRadius: 99 },
  activityCard: { backgroundColor: "#FFFFFF", borderRadius: 20, paddingHorizontal: 16 }, activityRow: { flexDirection: "row", gap: 10, paddingVertical: 15 }, activityBorder: { borderBottomWidth: 1, borderBottomColor: "#EEF0F5" }, activityIcon: { width: 33, height: 33, borderRadius: 12, alignItems: "center", justifyContent: "center" }, activityCopy: { flex: 1 }, activityText: { color: "#526078", fontSize: 12.5, lineHeight: 18, fontWeight: "600" }, activityTime: { color: "#9AA3B2", fontSize: 10.5, marginTop: 4 }, pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
});
