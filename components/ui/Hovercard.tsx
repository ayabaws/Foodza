import React, { createContext, useContext, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";

const HoverCardContext = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
}>({} as any);


export function HoverCard({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <HoverCardContext.Provider value={{ open, setOpen }}>
      {children}
    </HoverCardContext.Provider>
  );
}


export function HoverCardTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setOpen } = useContext(HoverCardContext);

  return (
    <Pressable
      onPress={() => setOpen(true)}
    >
      {children}
    </Pressable>
  );
}


export function HoverCardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open, setOpen } = useContext(HoverCardContext);

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        style={styles.overlay}
        onPress={() => setOpen(false)}
      >
        <View style={styles.card}>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 260,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 6,
  },
});