import { ChevronDown } from 'lucide-react-native'; // Assure-toi d'installer lucide-react-native
import React, { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';

// Pour activer LayoutAnimation sur Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  children: React.ReactNode;
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

export function Accordion({ children }: AccordionProps) {
  return <View>{children}</View>;
}

export function AccordionItem({ title, children }: AccordionItemProps) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View style={styles.item}>
      <Pressable onPress={toggleOpen} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <ChevronDown
          width={20}
          height={20}
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
        />
      </Pressable>
      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
});