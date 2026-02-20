import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View
} from "react-native";

// Types
type Toast = {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
};

type ToasterContextProps = {
  showToast: (message: string, type?: Toast["type"], duration?: number) => void;
};

// Contexte
const ToasterContext = createContext<ToasterContextProps | null>(null);

export function useToaster() {
  const context = useContext(ToasterContext);
  if (!context) throw new Error("useToaster must be used within ToasterProvider");
  return context;
}

// Provider
export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextId, setNextId] = useState(1);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info", duration = 3000) => {
      const id = nextId;
      setNextId(id + 1);
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    [nextId]
  );

  return (
    <ToasterContext.Provider value={{ showToast }}>
      {children}
      <View pointerEvents="box-none" style={styles.container}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </View>
    </ToasterContext.Provider>
  );
};

// Composant Toast
const ToastItem: React.FC<Toast> = ({ message, type = "info" }) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
  }, []);

  const backgroundColor =
    type === "success" ? "#4CAF50" : type === "error" ? "#F44336" : "#2196F3";

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor, transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

// Styles
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 0,
    width,
    alignItems: "center",
    zIndex: 1000,
    pointerEvents: "box-none",
  },
  toast: {
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: width * 0.7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: "white",
    fontSize: 14,
  },
});