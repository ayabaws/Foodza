import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";


type InputOTPProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
};

export function InputOTP({
  length = 6,
  value,
  onChange,
}: InputOTPProps) {
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const chars = value.split("");
    chars[index] = text;
    const newValue = chars.join("").slice(0, length);
    onChange(newValue);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (!value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref!)}
          style={[
            styles.slot,
            value[index] ? styles.filled : null
          ]}
          keyboardType="number-pad"
          maxLength={1}
          value={value[index] || ""}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Backspace") {
              handleBackspace(index);
            }
          }}
        />
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  slot: {
    width: 44,
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#fff",
  },
  filled: {
    borderColor: "#4f46e5",
  },
});


export function InputOTPSeparator() {
  return <Text style={{ marginHorizontal: 6 }}>—</Text>;
}