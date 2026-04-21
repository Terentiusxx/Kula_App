import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  FlatList,
  Text,
  ImageBackground,
  Animated,
  Dimensions,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../../../constants/Styles";
import ImageStory from "../../story/ImageStory";
import { Ionicons } from "@expo/vector-icons";
import PressEffect from "../../UI/PressEffect";
import { fetchNearbyUsers } from "../../../services/repositories/discoveryRepository";
// https://github.com/birdwingo/react-native-instagram-stories?tab=readme-ov-file

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const ITEM_SIZE = SCREEN_WIDTH / 5;
const TRANSLATE_VALUE = ITEM_SIZE / 2;
export const CONTAINER_HEIGHT = ITEM_SIZE + TRANSLATE_VALUE + 10;

const Stories = ({ followingsData }) => {
  const storiesRef = useRef(null);
  const [showStory, setShowStory] = useState(false);
  const ScrollX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [storyUsers, setStoryUsers] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadStoryUsers() {
      if (Array.isArray(followingsData) && followingsData.length > 0) {
        if (active) {
          setStoryUsers(followingsData);
        }
        return;
      }

      const result = await fetchNearbyUsers({ maxResults: 8, currentUser: {} });
      if (!active) {
        return;
      }
      setStoryUsers(result.ok ? result.data || [] : []);
    }

    loadStoryUsers();
    return () => {
      active = false;
    };
  }, [followingsData]);

  const data = useMemo(() => {
    const addStoryCard = {
      user_id: 0,
      user_image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      user_name: "Add",
      active: false,
      stories: [],
    };

    const mapped = (storyUsers || []).map((item, index) => ({
      user_id: index + 1,
      user_image:
        item.picturePath ||
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&q=80",
      user_name: item.username || item.fullName || "user",
      active: index % 3 === 0,
      stories: Array.isArray(item.stories)
        ? item.stories.map((story, sIndex) => ({
            story_id: sIndex + 1,
            story_image:
              story?.story_image ||
              story?.image ||
              "https://images.unsplash.com/photo-1493244040629-496f6d136cc3?w=600&q=80",
          }))
        : [
            {
              story_id: 1,
              story_image:
                item.picturePath ||
                "https://images.unsplash.com/photo-1493244040629-496f6d136cc3?w=600&q=80",
            },
          ],
    }));

    return [addStoryCard, ...mapped];
  }, [storyUsers]);

  return (
    <View>
      <Animated.FlatList
        keyExtractor={(data, index) => index.toString()}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          height: CONTAINER_HEIGHT + 20,
          paddingHorizontal: SCREEN_WIDTH / 2 - ITEM_SIZE / 2,
        }}
        snapToInterval={ITEM_SIZE}
        decelerationRate={"fast"}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: ScrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / ITEM_SIZE
          );
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
            (index + 2) * ITEM_SIZE,
          ];
          const scale = ScrollX.interpolate({
            inputRange,
            outputRange: [0.8, 0.8, 1, 0.8, 0.8],
          });
          const translateY = ScrollX.interpolate({
            inputRange,
            outputRange: [
              0,
              TRANSLATE_VALUE / 2,
              TRANSLATE_VALUE,
              TRANSLATE_VALUE / 2,
              0,
            ],
          });
          return (
            <PressEffect>
              <Pressable
                onPress={() => {
                  if (item.user_id == 0) {
                    navigation.navigate("AddStoryScreen");
                  } else {
                    navigation.navigate("ViewStoryScreen");
                  }
                }}
              >
                <Animated.View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    transform: [{ translateY }, { scale }],
                    width: ITEM_SIZE,
                    height: ITEM_SIZE,
                    marginVertical: 5,
                  }}
                  // onPress={() => {
                  //   setShowStory(true);
                  // }}
                >
                  <ImageBackground
                    source={{ uri: item.user_image }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    imageStyle={[
                      {
                        resizeMode: "cover",
                        borderRadius: 60,
                        backgroundColor: GlobalStyles.colors.gray,
                      },
                      item.user_id == 0 && {
                        borderWidth: 2,
                        borderColor: GlobalStyles.colors.magenta,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                      }}
                    >
                      {item.user_id == 0 && (
                        <Ionicons
                          style={{}}
                          name="add-circle"
                          size={25}
                          color={GlobalStyles.colors.magenta}
                        />
                      )}
                      {item.active && (
                        <Ionicons
                          style={{ right: 3, bottom: 5 }}
                          name="ellipse"
                          size={15}
                          color={GlobalStyles.colors.greenLight}
                        />
                      )}
                    </View>
                  </ImageBackground>
                </Animated.View>
              </Pressable>
            </PressEffect>
          );
        }}
      />

      {showStory && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showStory}
          statusBarTranslucent={true}
          onRequestClose={() => {
            setShowStory(!showStory);
          }}
        >
          <ImageStory setShowStory={setShowStory} stories={data?.stories} />
        </Modal>
      )}
    </View>
  );
};

export default Stories;

const styles = StyleSheet.create({
  story: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: GlobalStyles.colors.cyan,
  },
});
