import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "../../../constants/Styles";
import { FlatList } from "react-native";
import { RefreshControl } from "react-native";
import Post from "./Post";
import { CONTAINER_HEIGHT } from "../head/Stories";
import { useSharedValue } from "react-native-reanimated";
import { fetchFeedPosts } from "../../../services/repositories/postsRepository";

const Video = ({ StoryTranslate }) => {
  const lastScrollY = useSharedValue(0);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      const result = await fetchFeedPosts({ maxResults: 30 });
      if (active && result.ok) {
        setPosts(result.data || []);
      }
    }

    loadPosts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: GlobalStyles.colors.primary }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: GlobalStyles.styles.tabBarPadding,
        }}
        onMomentumScrollBegin={(event) => {
          const scrollY = event.nativeEvent.contentOffset.y;
          if (scrollY > lastScrollY.value)
            StoryTranslate.value = -CONTAINER_HEIGHT;
          else {
            StoryTranslate.value = 0;
          }
        }}
        onMomentumScrollEnd={(event) => {
          scrollY = event.nativeEvent.contentOffset.y;
          // if (scrollY < lastScrollY.value) StoryTranslate.value = 0;
          lastScrollY.value = scrollY;
        }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
        keyExtractor={(item, index) => String(item?._id || item?.id || index)}
        data={posts}
        renderItem={({ item }) => {
          return (
            <View>
              <Post post={item} />
            </View>
          );
        }}
      />
    </View>
  );
};

export default Video;

const styles = StyleSheet.create({});
