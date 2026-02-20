import React from "react";
import { Switch as RNSwitch, StyleSheet, View } from "react-native";

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  className?: any; // optionnel pour styles additionnels
};

const Switch: React.FC<SwitchProps> = ({ value, onValueChange, disabled, className }) => {
  return (
    <View style={[styles.container, className]}>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: "#E5E7EB", true: "#3B82F6" }} // équivalent bg-switch-background / bg-primary
        thumbColor={value ? "#FFFFFF" : "#F9FAFB"} // équivalent thumb colors
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Taille et alignement du switch
    width: 32,  // approximatif de "w-8"
    height: 20, // approximatif de "h-[1.15rem]"
    justifyContent: "center",
  },
});

export { Switch };
