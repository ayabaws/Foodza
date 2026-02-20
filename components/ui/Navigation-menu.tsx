import React, { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";


export function NavigationMenu({ children }: { children: React.ReactNode }) {
  return <View style={styles.menu}>{children}</View>;
}



export function NavigationMenuList({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.list}>{children}</View>;
}


export function NavigationMenuItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View>{children}</View>;
}


type TriggerProps = {
  label: string;
  children: React.ReactNode;
};

export function NavigationMenuTrigger({
  label,
  children,
}: TriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={styles.triggerText}>{label} ⌄</Text>
      </Pressable>

      <Modal transparent animationType="fade" visible={open}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.content}>{children}</View>
        </Pressable>
      </Modal>
    </>
  );
}


type LinkProps = {
  children: React.ReactNode;
  onPress?: () => void;
};

export function NavigationMenuLink({ children, onPress }: LinkProps) {
  return (
    <Pressable style={styles.link} onPress={onPress}>
      <Text style={styles.linkText}>{children}</Text>
    </Pressable>
  );
}



const styles = StyleSheet.create({
  menu: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 10,
    elevation: 3,
  },

  list: {
    flexDirection: "row",
    gap: 8,
  },

  trigger: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
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
    borderRadius: 12,
    padding: 10,
    minWidth: 200,
  },

  link: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  linkText: {
    fontSize: 14,
  },
});