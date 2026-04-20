import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KULA } from "../../../constants/Styles";
import PressEffect from "../../UI/PressEffect";

const Header = ({ navigation }) => (
  <View style={styles.container}>
    {/* Avatar placeholder — coloured initials circle */}
    <Pressable
      onPress={() => navigation.navigate("UserProfileScreen")}
    >
      <PressEffect>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>ME</Text>
        </View>
      </PressEffect>
    </Pressable>

    {/* Logo / title */}
    <View style={styles.titleBlock}>
      <Text style={styles.logo}>KULA</Text>
      <Text style={styles.subtitle}>Your community</Text>
    </View>

    {/* Action icons */}
    <View style={styles.iconsRow}>
      <PressEffect>
        <Pressable
          style={styles.iconBtn}
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <Ionicons name="search-outline" size={22} color={KULA.brown} />
        </Pressable>
      </PressEffect>
      <PressEffect>
        <Pressable
          style={styles.iconBtn}
          onPress={() => navigation.navigate("NotificationsScreen")}
        >
          <View>
            <Ionicons name="notifications-outline" size={22} color={KULA.brown} />
            {/* Unread dot */}
            <View style={styles.notifDot} />
          </View>
        </Pressable>
      </PressEffect>
    </View>
  </View>
);

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: KULA.teal,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },
  titleBlock: {
    alignItems: "center",
  },
  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: KULA.brown,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 11,
    color: KULA.muted,
    letterSpacing: 0.3,
  },
  iconsRow: {
    flexDirection: "row",
    gap: 4,
  },
  iconBtn: {
    padding: 6,
    marginLeft: 4,
  },
  notifDot: {
    position: "absolute",
    top: 1,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: KULA.terracotta,
    borderWidth: 1.5,
    borderColor: KULA.cream,
  },
});
