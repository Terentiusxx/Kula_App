import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { KULA, DEFAULT_DP } from "../../constants/Styles.js";
import PressEffect from "../UI/PressEffect.js";

const ProfileHead = ({ userData, viewMode }) => {
  const [profilePic] = React.useState(
    !!userData.picturePath ? userData.picturePath : DEFAULT_DP
  );
  const navigation = useNavigation();

  function Stat({ value, label, onPress }) {
    return (
      <Pressable style={styles.stat} onPress={onPress}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      {/* Avatar row */}
      <View style={styles.avatarRow}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: profilePic }} style={styles.avatar} />
          {/* Action badge */}
          <PressEffect
            style={styles.badgeBtn}
          >
            <Pressable
              style={styles.badgeBtn}
              onPress={() => {
                if (!viewMode) navigation.navigate("EditProfileScreen");
              }}
            >
              {viewMode ? (
                <Text style={styles.badgeIcon}>👋</Text>
              ) : (
                <Image
                  source={require("../../assets/edit.png")}
                  style={styles.badgeImage}
                />
              )}
            </Pressable>
          </PressEffect>

          {/* Message icon — view mode only */}
          {viewMode && (
            <PressEffect style={styles.msgBtn}>
              <Pressable
                style={styles.msgBtn}
                onPress={() => navigation.navigate("MessagesScreen")}
              >
                <Image
                  source={require("../../assets/chat-focused.png")}
                  style={styles.msgImage}
                />
              </Pressable>
            </PressEffect>
          )}
        </View>

        <View style={styles.nameBlock}>
          <Text style={styles.fullName}>{userData.fullName}</Text>
          <Text style={styles.username}>@{userData.username}</Text>
          {userData.bio ? (
            <Text style={styles.bio} numberOfLines={3}>{userData.bio}</Text>
          ) : null}
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <Stat value="255" label="Posts" />
        <View style={styles.divider} />
        <Stat value="14.6k" label="Followers" />
        <View style={styles.divider} />
        <Stat value="378" label="Following" />
      </View>
    </View>
  );
};

export default ProfileHead;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 16,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: KULA.white,
    resizeMode: "cover",
  },
  badgeBtn: {
    position: "absolute",
    bottom: 0,
    right: -4,
    backgroundColor: KULA.teal,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: KULA.white,
  },
  badgeIcon: {
    fontSize: 13,
  },
  badgeImage: {
    width: 14,
    height: 14,
    tintColor: KULA.white,
  },
  msgBtn: {
    position: "absolute",
    top: 0,
    left: -4,
    backgroundColor: KULA.terracotta,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: KULA.white,
  },
  msgImage: {
    width: 14,
    height: 14,
    tintColor: KULA.white,
  },
  nameBlock: {
    flex: 1,
    paddingTop: 4,
  },
  fullName: {
    fontSize: 20,
    fontWeight: "700",
    color: KULA.brown,
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: KULA.muted,
    marginBottom: 6,
  },
  bio: {
    fontSize: 13,
    color: KULA.brown,
    opacity: 0.75,
    lineHeight: 19,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: KULA.white,
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: KULA.brown,
  },
  statLabel: {
    fontSize: 12,
    color: KULA.muted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: KULA.border,
  },
});
