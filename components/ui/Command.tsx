// CommandNative.tsx
import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type CommandItemType = {
  id: string;
  label: string;
  shortcut?: string;
  onSelect: () => void;
};

type CommandDialogProps = {
  visible: boolean;
  onClose: () => void;
  items: CommandItemType[];
  placeholder?: string;
};

export function CommandDialog({
  visible,
  onClose,
  items,
  placeholder = "Search...",
}: CommandDialogProps) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!query) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, items]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.inputWrapper}>
            <Feather name="search" size={20} color="#888" />
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
          </View>
          {filteredItems.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No results found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    item.onSelect();
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.item,
                    pressed && { backgroundColor: "#eee" },
                  ]}
                >
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  {item.shortcut && <Text style={styles.itemShortcut}>{item.shortcut}</Text>}
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 16,
  },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: "80%",
    overflow: "hidden",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  empty: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  itemLabel: {
    fontSize: 16,
  },
  itemShortcut: {
    fontSize: 12,
    color: "#888",
  },
});