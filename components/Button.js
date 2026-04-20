import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { KULA } from "../constants/Styles";

function Button({ title, onPress, disabled, titleStyle, containerStyle, secondary }) {
  return (
    <View
      style={[
        styles.base,
        secondary ? styles.secondary : styles.primary,
        containerStyle,
        disabled && styles.disabled,
      ]}
    >
      <Pressable
        android_ripple={{
          color: secondary
            ? "rgba(193, 96, 58, 0.15)"
            : "rgba(255, 255, 255, 0.25)",
          foreground: true,
        }}
        style={styles.pressable}
        onPress={onPress}
        disabled={disabled}
      >
        <Text
          style={[
            styles.label,
            secondary ? styles.labelSecondary : styles.labelPrimary,
            titleStyle,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </View>
  );
}

export default Button;

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    overflow: "hidden",
  },
  primary: {
    backgroundColor: KULA.teal,
    shadowColor: KULA.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    backgroundColor: KULA.white,
    borderWidth: 1.5,
    borderColor: KULA.terracotta,
  },
  disabled: {
    opacity: 0.55,
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: "700",
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    letterSpacing: 0.3,
  },
  labelPrimary: {
    color: KULA.white,
  },
  labelSecondary: {
    color: KULA.terracotta,
  },
});
