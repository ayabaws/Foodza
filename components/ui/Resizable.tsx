import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

type PanelGroupProps = {
  children: React.ReactNode[];
  direction?: "horizontal" | "vertical";
  style?: any;
};

export function ResizablePanelGroup({
  children,
  direction = "horizontal",
  style,
}: PanelGroupProps) {
  const [sizes, setSizes] = useState<number[]>(
    children.map(() => 1 / children.length)
  );

  const handleMove = (index: number, delta: number) => {
    const newSizes = [...sizes];
    const total = newSizes[index] + newSizes[index + 1];
    let first = newSizes[index];
    let second = newSizes[index + 1];

    if (direction === "vertical") {
      first += delta;
      second -= delta;
    } else {
      first += delta;
      second -= delta;
    }

    if (first < 0.05 || second < 0.05) return;

    newSizes[index] = first;
    newSizes[index + 1] = second;

    setSizes(newSizes);
  };

  return (
    <View
      style={[
        styles.group,
        direction === "vertical" ? { flexDirection: "column" } : { flexDirection: "row" },
        style,
      ]}
    >
      {children.map((child, i) => (
        <React.Fragment key={i}>
          <View
            style={{
              flex: sizes[i],
              overflow: "hidden",
            }}
          >
            {child}
          </View>
          {i < children.length - 1 && (
            <ResizableHandle
              direction={direction}
              onMove={(delta) => handleMove(i, delta)}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

type PanelProps = {
  children: React.ReactNode;
  style?: any;
};

export function ResizablePanel({ children, style }: PanelProps) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

type HandleProps = {
  direction?: "horizontal" | "vertical";
  onMove: (delta: number) => void;
};

export function ResizableHandle({ direction = "horizontal", onMove }: HandleProps) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const delta = direction === "vertical" ? gestureState.dy / 200 : gestureState.dx / 200;
        onMove(delta);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
   <TouchableOpacity
  {...panResponder.panHandlers}
  activeOpacity={1}
  style={[
    styles.handle,
    direction === "vertical" 
      ? { 
          height: 16, 
          width: '100%',
        } 
      : { 
          width: 16, 
          height: '100%',
        },
  ]}
>
  <View style={styles.handleIcon}>
    <Feather 
      name={direction === 'vertical' ? 'maximize-2' : 'maximize-2'}
      size={16} 
      color="#666" 
    />
  </View>
</TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  group: {
    flex: 1,
  },
  panel: {
    flex: 1,
  },
  handle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleIcon: {
    transform: [{ scale: 0.7 }]
  }
});