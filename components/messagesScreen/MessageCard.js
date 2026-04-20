import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { KULA } from "../../constants/Styles";
import { useNavigation } from "@react-navigation/native";

const MessageCard = ({ message, index = 0 }) => {
  const navigation = useNavigation();

  if (!message) return null;

  return (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate("ChatScreen")}
      android_ripple={{ color: "rgba(29,158,117,0.08)", foreground: true }}
    >
      {/* Coloured initials avatar */}
      <View style={[styles.avatar, { backgroundColor: message.contactColor }]}>
        <Text style={styles.avatarText}>{message.contactInitials}</Text>
        {/* Origin flag overlay */}
        <Text style={styles.flag}>{message.originFlag}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{message.contactName}</Text>
          <Text style={styles.time}>{message.timestamp}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.preview} numberOfLines={1}>
            {message.lastMessage}
          </Text>
          {message.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{message.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default MessageCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: KULA.white,
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 16,
    padding: 14,
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    position: "relative",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  flag: {
    position: "absolute",
    bottom: -2,
    right: -4,
    fontSize: 14,
  },
  content: { flex: 1 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: { fontSize: 16, fontWeight: "700", color: KULA.brown },
  time: { fontSize: 12, color: KULA.muted },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preview: { fontSize: 14, color: KULA.muted, flex: 1, marginRight: 8 },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: KULA.teal,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 11, fontWeight: "700", color: KULA.white },
});
