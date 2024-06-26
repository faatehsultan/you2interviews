import {
  StyleSheet,
  Text,
  TextInput as TextInputBase,
  View,
} from "react-native";
import React from "react";

type TextInputProps = {
  label?: string;
  placeholder?: string;
  onChangeText?: any;
  onBlur?: any;
  value?: any;
  secureTextEntry?: boolean;
};

export default function TextInput({
  label,
  placeholder,
  onChangeText,
  onBlur,
  value,
  secureTextEntry = false,
}: TextInputProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInputBase
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 100,
    width: "100%",
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
  label: {
    fontSize: 13,
    paddingLeft: 18,
    marginVertical: 7,
  },
});
