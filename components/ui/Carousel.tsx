import { Ionicons } from '@expo/vector-icons'; // Assure-toi d'installer lucide-react-native
import React, { createContext, useContext, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type CarouselContextProps = {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const CarouselContext = createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be inside CarouselProvider");
  return context;
}

type CarouselProps = {
  children: React.ReactNode[];
  itemWidth?: number;
};

export function Carousel({ children, itemWidth }: CarouselProps) {
  const screenWidth = Dimensions.get("window").width;
  const width = itemWidth || screenWidth;

  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const scrollPrev = () => {
    if (index > 0) {
      flatListRef.current?.scrollToIndex({ index: index - 1 });
      setIndex(index - 1);
    }
  };

  const scrollNext = () => {
    if (index < children.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        scrollPrev,
        scrollNext,
        canScrollPrev: index > 0,
        canScrollNext: index < children.length - 1,
      }}
    >
      <View style={styles.container}>
        <FlatList
          horizontal
          ref={flatListRef}
          data={children}
          renderItem={({ item }) => (
            <View style={[{ width }, styles.item]}>{item}</View>
          )}
          keyExtractor={(_, i) => i.toString()}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false} // contrôle par boutons
        />
      </View>
    </CarouselContext.Provider>
  );
}

type CarouselButtonProps = {
  isNext?: boolean;
  style?: ViewStyle;
};

export function CarouselButton({ isNext = false, style }: CarouselButtonProps) {
  const { scrollNext, scrollPrev, canScrollNext, canScrollPrev } = useCarousel();

  const onPress = () => (isNext ? scrollNext() : scrollPrev());
  const disabled = isNext ? !canScrollNext : !canScrollPrev;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.button, style]}>
      <Ionicons 
        name={isNext ? "chevron-forward" : "chevron-back"} 
        size={24} 
        color={disabled ? "#999" : "#000"} 
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
  },
});