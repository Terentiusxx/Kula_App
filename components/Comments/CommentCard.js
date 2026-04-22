import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../constants/Styles";
function CommentCard({ comment }) {
  const avatar =
    comment?.author?.picturePath ||
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80";
  const authorName = comment?.author?.name || "Community Member";
  const text = comment?.text || "No comment text yet.";
  const time = comment?.time || "just now";

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: avatar }}
          style={{
            width: 50,
            height: 50,
            resizeMode: "cover",
            borderRadius: 50,
          }}
        />
        <View
          style={{
            flex: 1,
            marginHorizontal: 20,
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 14, color: "white" }}>
            {authorName}: {text}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.6)",
              alignSelf: "flex-end",
            }}
          >
            {time}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default CommentCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.primary300,
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
