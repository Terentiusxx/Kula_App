import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { wpx } from "../helpers/Scale";

const TopDescription = ({
  avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  username = "user",
  timeLabel = "recently",
}) => {
  return (
    <View style={styles.rowCenter}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View>
          <Image
            style={{
              width: 50,
              height: 50,
              resizeMode: "cover",
              borderRadius: 15,
            }}
            source={{ uri: avatar }}
          />
        </View>
        <Text
          numberOfLines={1}
          style={{ color: "white", fontWeight: "bold", marginStart: 10 }}
        >
          {username}
        </Text>
      </View>

      <Text style={{ color: "white" }}>{timeLabel}</Text>
    </View>
  );
};

export default TopDescription;

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
