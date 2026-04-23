import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import PostAdvance from "./PostAdvance";
import { CONTAINER_HEIGHT } from "../head/Stories";
import { useSharedValue } from "react-native-reanimated";
import { fetchFeedPosts } from "../../../services/repositories/postsRepository";
import { useFocusEffect } from "@react-navigation/native";

const Feed = ({ StoryTranslate }) => {
  const lastScrollY = useSharedValue(0);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadFeed() {
      const result = await fetchFeedPosts({ maxResults: 40 });
      if (active && result.ok) {
        setPosts(result.data || []);
      }
    }
    loadFeed();
    return () => {
      active = false;
    };
  }, []);

  async function refreshFeed() {
    setRefreshing(true);
    const result = await fetchFeedPosts({ maxResults: 40 });
    if (result.ok) {
      setPosts(result.data || []);
    }
    setRefreshing(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      refreshFeed();
    }, [])
  );

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshFeed} />}
        keyExtractor={(item) => item._id}
        data={posts}
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
