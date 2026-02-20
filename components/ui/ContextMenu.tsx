// ContextMenuNative.tsx
import React from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type ContextMenuItemType = {
  id: string;
  label: string;
  shortcut?: string;
  variant?: "default" | "destructive";
  checked?: boolean;
  onSelect: () => void;
};

type ContextMenuProps = {
  visible: boolean;
  onClose: () => void;
  items: ContextMenuItemType[];
  title?: string;
};

export function ContextMenu({
  visible,
  onClose,
  items,
  title,
}: ContextMenuProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menu}>
          {title && <Text style={styles.title}>{title}</Text>}
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.item,
                  pressed && styles.itemPressed,
                ]}
                onPress={() => {
                  item.onSelect();
                  onClose();
                }}
              >
                <View style={styles.itemContent}>
                  {item.checked !== undefined && (
                    <Text style={styles.checkbox}>
                      {item.checked ? "✔" : ""}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.itemLabel,
                      item.variant === "destructive" && styles.destructive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.shortcut && (
                    <Text style={styles.shortcut}>{item.shortcut}</Text>
                  )}
                </View>
              </Pressable>
            )}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    minWidth: 200,
    maxHeight: "80%",
    paddingVertical: 8,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  itemPressed: {
    backgroundColor: "#eee",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
  },
  destructive: {
    color: "red",
  },
  shortcut: {
    fontSize: 12,
    color: "#888",
  },
  checkbox: {
    width: 20,
    textAlign: "center",
    marginRight: 8,
  },
});