import { useBlogStore } from "@/lib/blog-store";
import type { ReactNode } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

export function GlobalBackgroundContainer({ children }: { children: ReactNode }) {
  const { customBackground, theme } = useBlogStore();

  if (customBackground) {
    return (
      <ImageBackground
        source={{ uri: customBackground }}
        style={[styles.container, { backgroundColor: theme.background }]}
        resizeMode="cover"
      >
        <View style={[styles.overlay, { backgroundColor: theme.background, opacity: 0.88 }]}>
          {children}
        </View>
      </ImageBackground>
    );
  }

  return <View style={[styles.container, { backgroundColor: theme.background }]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
});
