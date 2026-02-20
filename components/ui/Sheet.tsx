import React, { ReactNode } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type SheetProps = {
  visible: boolean;
  onClose: () => void;
  side?: "top" | "right" | "bottom" | "left";
  children: ReactNode;
};

export function Sheet({
  visible,
  onClose,
  side = "right",
  children,
}: SheetProps) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Exemple simple pour animation de slide
  const translateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(translateAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // Définir la translation selon le side
  const translateStyle = {
    transform: [
      side === "right"
        ? { translateX: translateAnim.interpolate({ inputRange: [0, 1], outputRange: [screenWidth, 0] }) }
        : side === "left"
        ? { translateX: translateAnim.interpolate({ inputRange: [0, 1], outputRange: [-screenWidth, 0] }) }
        : side === "top"
        ? { translateY: translateAnim.interpolate({ inputRange: [0, 1], outputRange: [-screenHeight, 0] }) }
        : { translateY: translateAnim.interpolate({ inputRange: [0, 1], outputRange: [screenHeight, 0] }) },
    ],
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Content */}
      <Animated.View
        style={[
          styles.sheetContent,
          translateStyle,
          sideStyles[side],
        ]}
      >
        {children}

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

export function SheetHeader({ children }: { children: ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function SheetFooter({ children }: { children: ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function SheetTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function SheetDescription({ children }: { children: ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheetContent: {
    position: "absolute",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  header: {
    paddingVertical: 10,
  },
  footer: {
    paddingVertical: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  description: {
    color: "#666",
    fontSize: 14,
  },
});

const sideStyles = StyleSheet.create({
  right: {
    top: 0,
    right: 0,
    bottom: 0,
    width: "75%",
  },
  left: {
    top: 0,
    left: 0,
    bottom: 0,
    width: "75%",
  },
  top: {
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
});