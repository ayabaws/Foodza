import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type SelectProps = {
  value: string | null;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  placeholder?: string;
};

export function Select({ value, onValueChange, items, placeholder }: SelectProps) {
  const [open, setOpen] = useState(false);

  const selectedItem = items.find((i) => i.value === value);

  return (
    <View>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen(true)}
      >
        <Text style={selectedItem ? styles.valueText : styles.placeholderText}>
          {selectedItem?.label || placeholder || "Select an option"}
        </Text>
        <Icon name="keyboard-arrow-down" size={20} color="#555" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setOpen(false)}
        />
        <View style={styles.content}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onValueChange(item.value);
                  setOpen(false);
                }}
              >
                <Text style={styles.itemText}>{item.label}</Text>
                {item.value === value && <Icon name="check" size={20} color="#007aff" />}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  valueText: {
    fontSize: 16,
    color: "#000",
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  content: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    maxHeight: "40%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  }
});