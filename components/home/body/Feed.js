import { StyleSheet, View } from "react-native";
import React from "react";
import { FlatList, RefreshControl } from "react-native";
import PostAdvance from "./PostAdvance";
import { MOCK_POSTS } from "../../../data/mockData";
import { CONTAINER_HEIGHT } from "../head/Stories";
import { useSharedValue } from "react-native-reanimated";

const Feed = ({ StoryTranslate }) => {
  const lastScrollY = useSharedValue(0);

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 120,
          gap: 16,
        }}
        onMomentumScrollBegin={(event) => {
          const scrollY = event.nativeEvent.contentOffset.y;
          if (scrollY > lastScrollY.value) StoryTranslate.value = true;
          else StoryTranslate.value = false;
        }}
        onMomentumScrollEnd={(event) => {
          lastScrollY.value = event.nativeEvent.contentOffset.y;
        }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
        keyExtractor={(item) => item._id}
        data={MOCK_POSTS}
        renderItem={({ item }) => (
          <View>
            <PostAdvance post={item} />
          </View>
        )}
      />
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
  },
});
