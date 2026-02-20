import React, { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type MenubarProps = {
  children: React.ReactNode;
};

export function Menubar({ children }: MenubarProps) {
  return <View style={styles.menubar}>{children}</View>;
}


type MenubarMenuProps = {
  title: string;
  children: React.ReactNode;
};

export function MenubarMenu({ title, children }: MenubarMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.trigger}>
        <Text style={styles.triggerText}>{title}</Text>
      </Pressable>

      <Modal transparent visible={open} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.content}>{children}</View>
        </Pressable>
      </Modal>
    </>
  );
}


type MenubarItemProps = {
  children: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
};

export function MenubarItem({
  children,
  onPress,
  destructive,
}: MenubarItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.item,
        destructive && styles.destructive,
      ]}
    >
      <Text
        style={[
          styles.itemText,
          destructive && styles.destructiveText,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}


export function MenubarSeparator() {
  return <View style={styles.separator} />;
}


type MenubarLabelProps = {
  children: React.ReactNode;
};

export function MenubarLabel({ children }: MenubarLabelProps) {
  return <Text style={styles.label}>{children}</Text>;
}



const styles = StyleSheet.create({
  menubar: {
    flexDirection: "row",
    padding: 4,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },

  trigger: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: "500",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    minWidth: 180,
  },

  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 14,
  },

  destructive: {
    backgroundColor: "#FEE2E2",
  },
  destructiveText: {
    color: "#DC2626",
  },

  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});