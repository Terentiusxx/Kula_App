import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { KULA } from "../../constants/Styles";

const ChatCard = ({ sender }) => {
  return (
    <View
      style={[
        styles.wrapper,
        sender ? styles.wrapperReceived : styles.wrapperSent,
      ]}
    >
      {/* Coloured initials avatar — received side only */}
      {sender && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
      )}

      <View style={[styles.bubble, sender ? styles.received : styles.sent]}>
        <Text style={sender ? styles.textReceived : styles.textSent}>
          Hey! Are you joining the community meetup this weekend?
        </Text>
        <Text style={[styles.time, sender ? styles.timeReceived : styles.timeSent]}>
          12:00 AM
        </Text>
      </View>
    </View>
  );
};

export default ChatCard;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginHorizontal: 16,
    marginVertical: 4,
  },
  wrapperSent: {
    justifyContent: "flex-end",
  },
  wrapperReceived: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: KULA.terracotta,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  bubble: {
    maxWidth: "72%",
    padding: 12,
    borderRadius: 18,
  },
  sent: {
    backgroundColor: KULA.teal,
    borderBottomRightRadius: 4,
  },
  received: {
    backgroundColor: KULA.white,
    borderBottomLeftRadius: 4,
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  textSent: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 21,
  },
  textReceived: {
    color: KULA.brown,
    fontSize: 15,
    lineHeight: 21,
  },
  time: {
    fontSize: 10,
    marginTop: 4,
  },
  timeSent: {
    color: "rgba(255,255,255,0.65)",
    textAlign: "right",
  },
  timeReceived: {
    color: KULA.muted,
  },
});
