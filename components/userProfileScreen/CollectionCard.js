import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
const { height, width } = Dimensions.get("window");
const size = width / 4 - 10;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80";

const CollectionCard = ({ images = [], title = "Collection" }) => {
  const navigation = useNavigation();
  const tileImages = [
    images[0] || FALLBACK_IMAGE,
    images[1] || FALLBACK_IMAGE,
    images[2] || FALLBACK_IMAGE,
    images[3] || FALLBACK_IMAGE,
  ];
  return (
    <Pressable
      onPress={() => {}}
      android_ripple={{ color: "rgba(255, 255, 255,0.5)", foreground: true }}
      style={styles.container}
    >
      <View style={styles.row}>
        <Image
          source={{ uri: tileImages[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{ uri: tileImages[1] }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.row}>
        <Image
          source={{ uri: tileImages[2] }}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{ uri: tileImages[3] }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={{ position: "absolute" }}>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

export default CollectionCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
    margin: 5,
    backgroundColor: "black",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: size,
    height: size,
    // margin: 5,
    opacity: 0.5,
  },
});
