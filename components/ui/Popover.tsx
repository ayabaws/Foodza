import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

type PopoverProps = {
  children: React.ReactNode;
};

type PopoverTriggerProps = {
  children: React.ReactNode;
  onPress?: () => void;
};

type PopoverContentProps = {
  children: React.ReactNode;
  width?: number;
  style?: any;
};

export function Popover({ children }: PopoverProps) {
  return <View>{children}</View>;
}

export function PopoverTrigger({ children, onPress }: PopoverTriggerProps) {
  return <Pressable onPress={onPress}>{children}</Pressable>;
}

export function PopoverContent({
  children,
  width = 300,
  style,
}: PopoverContentProps) {
  return (
    <View style={[styles.content, { width }, style]}>
      {children}
    </View>
  );
}

// Pour gérer l'affichage
export function PopoverWrapper({
  trigger,
  content,
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Pressable onPress={() => setVisible(true)}>{trigger}</Pressable>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <PopoverContent>{content}</PopoverContent>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});