import React, { createContext, ReactNode, useContext, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type SidebarContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}

type SidebarProviderProps = { children: ReactNode };
export function SidebarProvider({ children }: SidebarProviderProps) {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// ----- Sidebar -----
type SidebarProps = { children: ReactNode };
export function Sidebar({ children }: SidebarProps) {
  const { open } = useSidebar();
  const screenWidth = Dimensions.get("window").width;

  return (
    <Animated.View
      style={[
        styles.sidebar,
        { width: open ? 240 : 60, transform: [{ translateX: 0 }] },
      ]}
    >
      <ScrollView>{children}</ScrollView>
    </Animated.View>
  );
}

// ----- Sidebar Trigger -----
export function SidebarTrigger() {
  const { toggleSidebar } = useSidebar();
  return (
    <TouchableOpacity style={styles.trigger} onPress={toggleSidebar}>
      <Text style={{ color: "#fff" }}>☰</Text>
    </TouchableOpacity>
  );
}

// ----- Sidebar Header -----
export function SidebarHeader({ children }: { children: ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

// ----- Sidebar Footer -----
export function SidebarFooter({ children }: { children: ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

// ----- Sidebar Menu Item -----
type SidebarMenuItemProps = {
  title: string;
  onPress?: () => void;
};
export function SidebarMenuItem({ title, onPress }: SidebarMenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={{ color: "#fff" }}>{title}</Text>
    </TouchableOpacity>
  );
}

// ----- Styles -----
const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: "#111",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 10,
    paddingTop: 20,
  },
  trigger: {
    position: "absolute",
    top: 40,
    left: 10,
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 5,
    zIndex: 20,
  },
  header: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#333" },
  footer: { padding: 10, borderTopWidth: 1, borderTopColor: "#333", marginTop: "auto" },
  menuItem: { padding: 10 },
});