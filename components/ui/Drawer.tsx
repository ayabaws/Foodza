import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

/* ================= ROOT ================= */

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Drawer({ open, onClose, children }: DrawerProps) {
  return (
    <Modal transparent visible={open} animationType="none">
      <DrawerOverlay onClose={onClose} />
      {children}
    </Modal>
  );
}

/* ================= OVERLAY ================= */

function DrawerOverlay({ onClose }: { onClose: () => void }) {
  return (
    <Pressable style={styles.overlay} onPress={onClose} />
  );
}

/* ================= CONTENT ================= */

function DrawerContent({ children }: { children: React.ReactNode }) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.content,
        { transform: [{ translateY }] },
      ]}
    >
      <View style={styles.handle} />
      {children}
    </Animated.View>
  );
}

/* ================= HEADER / FOOTER ================= */

function DrawerHeader({ children }: { children: React.ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

function DrawerFooter({ children }: { children: React.ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

/* ================= TITLE / DESCRIPTION ================= */

function DrawerTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

function DrawerDescription({ children }: { children: React.ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  handle: {
    width: 100,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginVertical: 12,
  },
  header: {
    padding: 16,
  },
  footer: {
    padding: 16,
    marginTop: "auto",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

/* ================= EXPORT ================= */

export {
    Drawer,
    DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle
};
