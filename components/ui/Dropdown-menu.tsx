import React, { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

export function DropdownMenu({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        {trigger}
      </Pressable>

      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            {children}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export function DropdownMenuItem({
  label,
  onPress,
  destructive,
}: {
  label: string;
  onPress?: () => void;
  destructive?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        pressed && styles.itemPressed,
      ]}
    >
      <Text
        style={[
          styles.itemText,
          destructive && { color: "red" },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function DropdownMenuCheckboxItem({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable onPress={onToggle} style={styles.item}>
      <Icon
        name={checked ? "check-square" : "square"}
        size={18}
      />
      <Text style={styles.itemText}>{label}</Text>
    </Pressable>
  );
}

export function DropdownMenuRadioItem({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable onPress={onSelect} style={styles.item}>
      <Icon
        name={selected ? "radio" : "circle"}
        size={16}
      />
      <Text style={styles.itemText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    minWidth: 180,
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  itemPressed: {
    backgroundColor: "#eee",
  },
  itemText: {
    fontSize: 14,
  },
});