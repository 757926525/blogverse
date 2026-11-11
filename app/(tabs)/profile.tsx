import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Avatar, BrandMark } from "@/components/blog/blog-ui";
import { useBlogStore } from "@/lib/blog-store";
import { pickLocalImages } from "@/lib/image-picker";
import { LANGUAGE_OPTIONS, type SupportedLanguage } from "@/lib/i18n";
import { THEME_STYLES, TIMEZONES } from "@/lib/theme-presets";

export default function ProfileScreen() {
  const {
    savedIds,
    readIds,
    likedIds,
    isAdmin,
    adminLogin,
    adminLogout,
    changeAdminPassword,
    siteName,
    syncStatus,
    syncMessage,
    syncWithCloud,
    setSiteName,
    userAvatar,
    setUserAvatar,
    customBackground,
    setCustomBackground,
    theme,
    setThemeId,
    language,
    setLanguage,
    t,
    timezone,
    setTimezone,
    currentTimeString,
    currentDateString,
  } = useBlogStore();

  // Modals state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSiteNameModal, setShowSiteNameModal] = useState(false);

  // Form inputs
  const [inputPassword, setInputPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const [newSiteName, setNewSiteName] = useState(siteName);

  const stats = [
    { value: "12", label: "连续阅读" },
    { value: String(readIds.length + 16), label: "已读文章" },
    { value: String(savedIds.length), label: "已收藏" },
  ];

  const handleLogin = () => {
    setLoginError("");
    const success = adminLogin(inputPassword);
    if (success) {
      setShowLoginModal(false);
      setInputPassword("");
    } else {
      setLoginError("密码不正确，请重新输入");
    }
  };

  const handleChangePassword = () => {
    setPasswordMsg("");
    if (!newPassword.trim()) {
      setPasswordMsg("密码不能为空");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("两次输入的密码不一致");
      return;
    }
    changeAdminPassword(newPassword.trim());
    setPasswordMsg("密码修改成功！");
    setTimeout(() => {
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMsg("");
    }, 1200);
  };

  const handlePickAvatar = async () => {
    const images = await pickLocalImages(false);
    if (images.length > 0) {
      setUserAvatar(images[0]);
    }
  };

  const handlePickBackground = async () => {
    const images = await pickLocalImages(false);
    if (images.length > 0) {
      setCustomBackground(images[0]);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Top bar */}
        <View style={styles.topRow}>
          <Text style={[styles.eyebrow, { color: theme.subText }]}>MY SPACE · {siteName}</Text>
          <BrandMark compact />
        </View>

        {/* Live Network Time Clock */}
        <View style={[styles.clockCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={styles.clockHeader}>
            <View style={styles.clockLiveBadge}>
              <View style={[styles.liveDot, { backgroundColor: theme.accent }]} />
              <Text style={[styles.liveText, { color: theme.accent }]}>实时网络时钟</Text>
            </View>
            <Text style={[styles.timezoneName, { color: theme.subText }]}>{timezone}</Text>
          </View>
          <Text style={[styles.clockTime, { color: theme.text }]}>{currentTimeString}</Text>
          <Text style={[styles.clockDate, { color: theme.subText }]}>{currentDateString}</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileRow}>
          <Pressable onPress={handlePickAvatar} style={styles.avatarWrap}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.customAvatar} />
            ) : (
              <Avatar name="沐" tone={theme.accentSoft} size={64} />
            )}
            <View style={[styles.avatarCameraBadge, { backgroundColor: theme.primary }]}>
              <Ionicons name="camera-outline" size={13} color="#FFFFFF" />
            </View>
          </Pressable>
          <View style={styles.profileCopy}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: theme.text }]}>沐言</Text>
              {isAdmin ? (
                <View style={[styles.adminBadge, { backgroundColor: theme.accent }]}>
                  <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
                  <Text style={styles.adminBadgeText}>管理员</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.handle, { color: theme.subText }]}>@muyan · 正在阅读与记录</Text>
            <View style={[styles.memberPill, { backgroundColor: theme.accentSoft }]}>
              <Ionicons name="sparkles" size={12} color={theme.accent} />
              <Text style={[styles.memberText, { color: theme.accent }]}>
                {isAdmin ? "管理员权限已激活" : "第 3 年阅读者"}
              </Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isAdmin ? "退出管理" : "管理员登录"}
            onPress={() => (isAdmin ? adminLogout() : setShowLoginModal(true))}
            style={({ pressed }) => [
              styles.authButton,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={isAdmin ? "log-out-outline" : "key-outline"}
              size={18}
              color={isAdmin ? "#E6675B" : theme.primary}
            />
          </Pressable>
        </View>

        {/* Stats */}
        <View style={[styles.statCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          {stats.map((stat, index) => (
            <View
              key={stat.label}
              style={[styles.statItem, index < stats.length - 1 && [styles.statDivider, { borderRightColor: theme.border }]]}
            >
              <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.subText }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings Area (设置区) */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>应用设置区</Text>
          <Text style={[styles.sectionMeta, { color: theme.subText }]}>个性化与管理</Text>
        </View>

        <View style={[styles.settingsCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          {/* Modify Theme Name */}
          <Pressable
            onPress={() => {
              setNewSiteName(siteName);
              setShowSiteNameModal(true);
            }}
            style={[styles.settingRow, { borderBottomColor: theme.border }]}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="text-outline" size={19} color={theme.primary} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>修改主题名称</Text>
                <Text style={[styles.settingSub, { color: theme.subText }]}>当前名称：{siteName}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.subText} />
          </Pressable>

          {/* Modify Avatar */}
          <Pressable onPress={handlePickAvatar} style={[styles.settingRow, { borderBottomColor: theme.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="person-circle-outline" size={19} color={theme.primary} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>修改本地头像</Text>
                <Text style={[styles.settingSub, { color: theme.subText }]}>选择本地照片设为个人头像</Text>
              </View>
            </View>
            <Ionicons name="cloud-upload-outline" size={18} color={theme.accent} />
          </Pressable>

          {/* Custom Global Background */}
          <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="image-outline" size={19} color={theme.primary} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>全局背景壁纸</Text>
                <Text style={[styles.settingSub, { color: theme.subText }]}>
                  {customBackground ? "已设置自定义背景" : "当前使用默认纯色背景"}
                </Text>
              </View>
            </View>
            <View style={styles.bgActionButtons}>
              <Pressable
                onPress={handlePickBackground}
                style={[styles.smallBtn, { backgroundColor: theme.accentSoft }]}
              >
                <Text style={[styles.smallBtnText, { color: theme.accent }]}>上传图片</Text>
              </Pressable>
              {customBackground ? (
                <Pressable
                  onPress={() => setCustomBackground(null)}
                  style={[styles.smallBtn, { backgroundColor: "#FFF0F0" }]}
                >
                  <Text style={[styles.smallBtnText, { color: "#E6675B" }]}>清除</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          {/* Cloud Sync (D1 / KV) */}
          <Pressable
            onPress={() => void syncWithCloud()}
            style={[styles.settingRow, { borderBottomColor: theme.border }]}
          >
            <View style={styles.settingLeft}>
              <Ionicons
                name={syncStatus === "syncing" ? "sync" : syncStatus === "success" ? "cloud-done-outline" : "cloud-upload-outline"}
                size={19}
                color={syncStatus === "error" ? "#EF4444" : theme.primary}
              />
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>云端数据同步</Text>
                <Text style={[styles.settingSub, { color: theme.subText }]}>
                  {syncMessage || "连接 Cloudflare D1 / KV 同步文章与设置"}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.subText} />
          </Pressable>

          {/* Change Admin Password */}
          {isAdmin ? (
            <Pressable
              onPress={() => setShowPasswordModal(true)}
              style={[styles.settingRow, { borderBottomColor: theme.border }]}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="lock-closed-outline" size={19} color={theme.primary} />
                <View>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>修改管理员密码</Text>
                  <Text style={[styles.settingSub, { color: theme.subText }]}>随时更新您的登录口令</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.subText} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setShowLoginModal(true)}
              style={[styles.settingRow, { borderBottomColor: theme.border }]}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="shield-outline" size={19} color={theme.accent} />
                <View>
                  <Text style={[styles.settingTitle, { color: theme.accent }]}>管理员登录面板</Text>
                  <Text style={[styles.settingSub, { color: theme.subText }]}>登录以解锁发布、编辑、删除文章权限</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.accent} />
            </Pressable>
          )}

          {/* Timezone Selector */}
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="globe-outline" size={19} color={theme.primary} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>时区设置</Text>
                <Text style={[styles.settingSub, { color: theme.subText }]}>选择全球网络时间基准</Text>
              </View>
            </View>
          </View>

          {/* Timezone Options Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tzScroll}>
            {TIMEZONES.map((tz) => {
              const selected = tz.zone === timezone;
              return (
                <Pressable
                  key={tz.zone}
                  onPress={() => setTimezone(tz.zone)}
                  style={[
                    styles.tzPill,
                    {
                      backgroundColor: selected ? theme.primary : theme.cardBg,
                      borderColor: selected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.tzPillText, { color: selected ? "#FFFFFF" : theme.subText }]}>
                    {tz.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Language Selection */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("languageSectionTitle")}</Text>
          <Text style={[styles.sectionMeta, { color: theme.subText }]}>{t("languageSectionDesc")}</Text>
        </View>

        <View style={styles.langGrid}>
          {LANGUAGE_OPTIONS.map((item) => {
            const active = item.code === language;
            return (
              <Pressable
                key={item.code}
                onPress={() => setLanguage(item.code as SupportedLanguage)}
                style={[
                  styles.langCard,
                  {
                    backgroundColor: active ? theme.primary : theme.cardBg,
                    borderColor: active ? theme.accent : theme.border,
                    borderRadius: theme.borderRadius,
                    borderWidth: active ? 2 : 1,
                  },
                ]}
              >
                <Text style={styles.langFlag}>{item.flag}</Text>
                <Text style={[styles.langName, { color: active ? "#FFFFFF" : theme.text }]}>{item.name}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* 10+ Theme Styles Switcher */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("themeSectionTitle")}</Text>
          <Text style={[styles.sectionMeta, { color: theme.subText }]}>{theme.name} · {theme.tagline}</Text>
        </View>

        <View style={styles.themesGrid}>
          {THEME_STYLES.map((item) => {
            const active = item.id === theme.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setThemeId(item.id)}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: item.background,
                    borderColor: active ? item.accent : item.border,
                    borderWidth: active ? item.borderWidth + 1 : item.borderWidth,
                    borderRadius: item.borderRadius,
                  },
                ]}
              >
                <View style={styles.themePaletteRow}>
                  <View style={[styles.colorDot, { backgroundColor: item.primary }]} />
                  <View style={[styles.colorDot, { backgroundColor: item.accent }]} />
                  <View style={[styles.colorDot, { backgroundColor: item.accentSoft }]} />
                </View>
                <Text style={[styles.themeCardName, { color: item.text }]}>{item.name}</Text>
                {active ? (
                  <View style={[styles.activeThemeCheck, { backgroundColor: item.accent }]}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {/* Recent Activities */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>最近活动</Text>
          <Text style={[styles.sectionMeta, { color: theme.subText }]}>{likedIds.length} 个喜欢</Text>
        </View>
        <View style={[styles.activityCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Activity
            icon="bookmark"
            color={theme.accent}
            text="收藏了《好界面不是更炫，而是更懂得克制》"
            time="今天"
            theme={theme}
          />
          <Activity
            icon="heart"
            color="#E6675B"
            text="喜欢了《把注意力还给自己》"
            time="昨天"
            last
            theme={theme}
          />
        </View>
      </ScrollView>

      {/* Admin Login Modal */}
      <Modal visible={showLoginModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>管理员登录</Text>
              <Pressable onPress={() => setShowLoginModal(false)}>
                <Ionicons name="close" size={22} color={theme.subText} />
              </Pressable>
            </View>
            <Text style={[styles.modalDesc, { color: theme.subText }]}>
              请输入管理员密码以解锁发布、编辑和删除文章等管理功能。
            </Text>

            <TextInput
              secureTextEntry
              value={inputPassword}
              onChangeText={setInputPassword}
              placeholder="请输入管理员密码（默认 123456）"
              placeholderTextColor="#A0AEC0"
              style={[styles.modalInput, { color: theme.text, borderColor: theme.border }]}
              autoFocus
            />

            {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowLoginModal(false)}
                style={[styles.modalCancelBtn, { borderColor: theme.border }]}
              >
                <Text style={{ color: theme.subText, fontWeight: "700" }}>取消</Text>
              </Pressable>
              <Pressable
                onPress={handleLogin}
                style={[styles.modalConfirmBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>登录</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modify Password Modal */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>修改管理员密码</Text>
              <Pressable onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={22} color={theme.subText} />
              </Pressable>
            </View>

            <TextInput
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="新密码"
              placeholderTextColor="#A0AEC0"
              style={[styles.modalInput, { color: theme.text, borderColor: theme.border }]}
            />
            <TextInput
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="确认新密码"
              placeholderTextColor="#A0AEC0"
              style={[styles.modalInput, { color: theme.text, borderColor: theme.border, marginTop: 12 }]}
            />

            {passwordMsg ? (
              <Text
                style={{
                  color: passwordMsg.includes("成功") ? theme.accent : "#E6675B",
                  fontSize: 12,
                  marginTop: 8,
                }}
              >
                {passwordMsg}
              </Text>
            ) : null}

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowPasswordModal(false)}
                style={[styles.modalCancelBtn, { borderColor: theme.border }]}
              >
                <Text style={{ color: theme.subText, fontWeight: "700" }}>取消</Text>
              </Pressable>
              <Pressable
                onPress={handleChangePassword}
                style={[styles.modalConfirmBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>保存新密码</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modify Site Name Modal */}
      <Modal visible={showSiteNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>自定义主题名称</Text>
              <Pressable onPress={() => setShowSiteNameModal(false)}>
                <Ionicons name="close" size={22} color={theme.subText} />
              </Pressable>
            </View>
            <Text style={[styles.modalDesc, { color: theme.subText }]}>
              为应用指定您喜欢的全站名称（如：灵感漫游、时光专栏等）。
            </Text>

            <TextInput
              value={newSiteName}
              onChangeText={setNewSiteName}
              placeholder="请输入主题名称"
              placeholderTextColor="#A0AEC0"
              maxLength={20}
              style={[styles.modalInput, { color: theme.text, borderColor: theme.border }]}
              autoFocus
            />

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowSiteNameModal(false)}
                style={[styles.modalCancelBtn, { borderColor: theme.border }]}
              >
                <Text style={{ color: theme.subText, fontWeight: "700" }}>取消</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (newSiteName.trim()) {
                    setSiteName(newSiteName.trim());
                  }
                  setShowSiteNameModal(false);
                }}
                style={[styles.modalConfirmBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>保存</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Activity({
  icon,
  color,
  text,
  time,
  last = false,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  text: string;
  time: string;
  last?: boolean;
  theme: any;
}) {
  return (
    <View style={[styles.activityRow, !last && [styles.activityBorder, { borderBottomColor: theme.border }]]}>
      <View style={[styles.activityIcon, { backgroundColor: `${color}17` }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <View style={styles.activityCopy}>
        <Text style={[styles.activityText, { color: theme.text }]}>{text}</Text>
        <Text style={[styles.activityTime, { color: theme.subText }]}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 40 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eyebrow: { fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  clockCard: {
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
  },
  clockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  clockLiveBadge: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  liveText: { fontSize: 11, fontWeight: "800" },
  timezoneName: { fontSize: 11, fontWeight: "600" },
  clockTime: { fontSize: 32, fontWeight: "900", letterSpacing: 1 },
  clockDate: { fontSize: 12, marginTop: 4, fontWeight: "600" },

  profileRow: { flexDirection: "row", alignItems: "center", marginTop: 22 },
  avatarWrap: { position: "relative" },
  customAvatar: { width: 64, height: 64, borderRadius: 32 },
  avatarCameraBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileCopy: { flex: 1, marginLeft: 14 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { fontSize: 24, fontWeight: "900", letterSpacing: -0.6 },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  adminBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  handle: { fontSize: 12, marginTop: 3 },
  memberPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 7,
  },
  memberText: { fontSize: 10, fontWeight: "800" },
  authButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  statCard: {
    flexDirection: "row",
    borderRadius: 20,
    paddingVertical: 17,
    marginTop: 22,
    borderWidth: 1,
  },
  statItem: { flex: 1, alignItems: "center" },
  statDivider: { borderRightWidth: 1 },
  statValue: { fontSize: 19, fontWeight: "900" },
  statLabel: { fontSize: 10.5, fontWeight: "700", marginTop: 3 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: "900" },
  sectionMeta: { fontSize: 11, fontWeight: "700" },

  settingsCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  settingTitle: { fontSize: 14, fontWeight: "800" },
  settingSub: { fontSize: 11.5, marginTop: 2 },
  bgActionButtons: { flexDirection: "row", gap: 8 },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  smallBtnText: { fontSize: 11.5, fontWeight: "800" },

  tzScroll: { paddingHorizontal: 16, paddingBottom: 14, gap: 8 },
  tzPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  tzPillText: { fontSize: 11, fontWeight: "700" },

  themesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  themeCard: {
    width: "48%",
    borderRadius: 16,
    padding: 12,
    position: "relative",
  },
  themePaletteRow: { flexDirection: "row", gap: 5, marginBottom: 8 },
  colorDot: { width: 14, height: 14, borderRadius: 7 },
  themeCardName: { fontSize: 13, fontWeight: "800" },
  themeCardDesc: { fontSize: 10, marginTop: 2 },
  themeCheck: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  activeThemeCheck: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  langGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  langCard: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  langFlag: {
    fontSize: 20,
    marginBottom: 4,
  },
  langName: {
    fontSize: 11.5,
    fontWeight: "700",
  },

  activityCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  activityRow: { flexDirection: "row", gap: 10, paddingVertical: 15 },
  activityBorder: { borderBottomWidth: 1 },
  activityIcon: { width: 33, height: 33, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  activityCopy: { flex: 1 },
  activityText: { fontSize: 12.5, lineHeight: 18, fontWeight: "600" },
  activityTime: { fontSize: 10.5, marginTop: 4 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    padding: 22,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: { fontSize: 18, fontWeight: "900" },
  modalDesc: { fontSize: 12.5, lineHeight: 18, marginBottom: 16 },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  errorText: { color: "#E6675B", fontSize: 12, marginTop: 8 },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalConfirmBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
