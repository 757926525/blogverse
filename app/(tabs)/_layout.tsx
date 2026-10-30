import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";

const ink = "#18233F";
const inactive = "#9AA4B6";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  const tabBarHeight = 58 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ink,
        tabBarInactiveTintColor: inactive,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: "700", marginTop: 1 },
        tabBarStyle: {
          paddingTop: 7,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: "#FEFEFF",
          borderTopColor: "#E8EBF2",
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "发现",
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "compass" : "compass-outline"} size={23} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "收藏",
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "bookmark" : "bookmark-outline"} size={23} color={color} />,
        }}
      />
      <Tabs.Screen
        name="write"
        options={{
          title: "创作",
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "create" : "create-outline"} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "我的",
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={23} color={color} />,
        }}
      />
    </Tabs>
  );
}
