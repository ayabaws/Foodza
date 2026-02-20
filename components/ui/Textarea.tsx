import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

type TextareaProps = TextInputProps & {
  className?: any; // pour compatibilité si tu veux passer un style supplémentaire
};

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <TextInput
      multiline
      textAlignVertical="top" // pour que le texte commence en haut
      placeholderTextColor="#6B7280" // équivalent placeholder:text-muted-foreground
      style={[styles.textarea, className]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    minHeight: 64, // équivalent min-h-16 (~16*4=64)
    width: "100%",
    paddingHorizontal: 12, // px-3
    paddingVertical: 8, // py-2
    borderWidth: 1,
    borderColor: "#D1D5DB", // border-input
    borderRadius: 8, // rounded-md
    backgroundColor: "#F9FAFB", // bg-input-background
    fontSize: 16, // text-base
    color: "#111827", // text color par défaut
  },
});