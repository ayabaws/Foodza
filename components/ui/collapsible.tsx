// CollapsibleNative.tsx
import React, { useEffect, useRef, useState } from "react";
import { Animated, LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from "react-native";

type CollapsibleProps = {
  children: React.ReactNode;
  open?: boolean;
};

type CollapsibleTriggerProps = {
  children: React.ReactNode;
  onPress?: () => void;
};

type CollapsibleContentProps = {
  children: React.ReactNode;
  open?: boolean;
};

// Pour activer LayoutAnimation sur Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Composant principal
export const Collapsible = ({ children, open = false }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(open);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  // On passe toggle aux triggers via React.cloneElement
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { isOpen, toggle });
  });

  return <View>{childrenWithProps}</View>;
};

// Trigger
export const CollapsibleTrigger = ({ children, onPress, toggle, isOpen }: CollapsibleTriggerProps & { toggle?: () => void; isOpen?: boolean }) => {
  return (
    <Pressable
      onPress={() => {
        toggle && toggle();
        onPress && onPress();
      }}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      {children}
    </Pressable>
  );
};

// Content
export const CollapsibleContent = ({ children, isOpen }: CollapsibleContentProps & { isOpen?: boolean }) => {
  const animation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isOpen, animation]);

  return (
    <Animated.View style={[styles.content, { height: isOpen ? undefined : 0, overflow: "hidden" }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    overflow: "hidden",
  },
});