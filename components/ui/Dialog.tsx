import React, { ReactNode } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type DialogProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Dialog({ visible, onClose, children }: DialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
}

type DialogContentProps = {
  children: ReactNode;
  onClose?: () => void;
};

export function DialogContent({ children, onClose }: DialogContentProps) {
  return (
    <View>
      {onClose && (
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      )}
      {children}
    </View>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: "#555",
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
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