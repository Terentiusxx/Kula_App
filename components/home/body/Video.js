import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { GlobalStyles } from "../../../constants/Styles";
import { FlatList } from "react-native";
import { RefreshControl } from "react-native";
import Post from "./Post";
// MOCK MODE: Using MOCK_POSTS — replace with paginated API call when backend is ready
import { MOCK_POSTS } from "../../../data/mockData";
import { CONTAINER_HEIGHT } from "../head/Stories";
import { useSharedValue } from "react-native-reanimated";

const Video = ({ StoryTranslate }) => {
  const lastScrollY = useSharedValue(0);
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
        keyExtractor={(data, index) => index.toString()}
        data={[1, 2, 3, 4, 5, 6]}
        renderItem={({ data, index }) => {
          return (
            <View>
              <Post post={index % 2 === 0 ? MOCK_POSTS[0] : MOCK_POSTS[1]} />
            </View>
          );
        }}
      />
    </View>
  );
};

export default Video;

const styles = StyleSheet.create({});
