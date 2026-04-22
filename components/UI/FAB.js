import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KULA } from "../../constants/Styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FAB({ onPress, icon = "menu" }) {
  const insets = useSafeAreaInsets();
  return (
    <TouchableOpacity
      style={[styles.fab, { bottom: Math.max(90, insets.bottom + 70) }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons name={icon} size={24} color="#FFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: KULA.teal,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: KULA.teal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 99,
  },
});
