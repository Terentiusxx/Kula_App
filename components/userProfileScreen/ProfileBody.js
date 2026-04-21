import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Image,
  useWindowDimensions,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { GlobalStyles } from "../../constants/Styles.js";
import { FlatList } from "react-native-gesture-handler";
import CollectionCard from "./CollectionCard.js";

import React, { useState, useEffect, useContext } from "react";
import Post from "../../components/userProfileScreen/Post";
import { AuthContext } from "../../store/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { fetchFeedPosts, fetchUserPosts } from "../../services/repositories/postsRepository";

const TopTab = createMaterialTopTabNavigator();

function Posts({ navigation, route, refreshing }) {
  const authCtx = useContext(AuthContext);
  const [fetching, setFetching] = useState(true);
  const [errorFetching, setErrorFetching] = useState(false);
  const [posts, setPosts] = useState([]);
  const { width } = useWindowDimensions();
  const emptySize = Math.min(320, Math.max(180, width * 0.72));
  const getPosts = async () => {
    try {
      setFetching(true);
      const userId = authCtx.userData?._id || authCtx.userData?.id;
      const result = await fetchUserPosts(userId, { maxResults: 40 });
      setErrorFetching(false);
      if (result.ok) {
        setPosts(result.data || []);
      } else {
        setPosts([]);
      }
    } catch (error) {
      setErrorFetching(true);
      console.log(error);
    }
    setFetching(false);
  };
  useEffect(() => {
    getPosts();
  }, []);
  useEffect(() => {
    if (refreshing) {
      console.log("refreshing");
      getPosts();
    }
  }, [refreshing]);
  return (
    <View style={{ flex: 1, backgroundColor: GlobalStyles.colors.primary }}>
      {fetching ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={50} color={GlobalStyles.colors.purple} />
        </View>
      ) : errorFetching ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Pressable onPress={getPosts}>
            <Ionicons
              name="reload-circle"
              color={GlobalStyles.colors.purple}
              size={50}
            />
            <Text
              style={{ color: GlobalStyles.colors.purple, fontWeight: "bold" }}
            >
              Reload
            </Text>
          </Pressable>
        </View>
      ) : posts.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              margin: 5,
              marginBottom: GlobalStyles.styles.tabBarPadding,
            }}
          >
            <View style={{ flex: 1 }}>
              {posts.map((item, index) => (
                <View key={index}>
                  {index % 2 === 0 && <Post postData={posts[index]} />}
                </View>
              ))}
            </View>
            <View style={{ flex: 1 }}>
              {posts.map((item, index) => (
                <View key={index}>
                  {index % 2 !== 0 && <Post postData={posts[index]} />}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/no-photo.jpg")}
            style={{
              width: emptySize,
              height: emptySize,
              resizeMode: "contain",
            }}
          />
        </View>
      )}
    </View>
  );
}

function Videos() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadCollections() {
      const result = await fetchFeedPosts({ maxResults: 12 });
      if (!active || !result.ok) {
        return;
      }
      const items = (result.data || []).slice(0, 6);
      setCollections(items);
    }
    loadCollections();
    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={{ backgroundColor: GlobalStyles.colors.primary }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: GlobalStyles.styles.tabBarPadding,
        }}
        keyExtractor={(data, index) => index.toString()}
        data={collections}
        numColumns={2}
        keyExtractor={(item, index) => String(item?._id || item?.id || index)}
        renderItem={({ item, index }) => {
          const images = [
            item?.picturePath || item?.image,
            item?.thumbnailPath || item?.picturePath || item?.image,
            item?.coverImage || item?.picturePath || item?.image,
            item?.picturePath || item?.image,
          ].filter(Boolean);
          return (
            <View>
              <CollectionCard images={images} title={item?.title || "Collection"} />
            </View>
          );
        }}
      />
    </View>
  );
}
const ProfileBody = ({ refreshing }) => {
  const { width } = useWindowDimensions();
  const labelSize = Math.min(18, Math.max(14, width * 0.042));
  const indicatorWidth = Math.min(50, Math.max(28, width * 0.1));
  const indicatorLeft = Math.max(12, width * 0.2 - indicatorWidth / 2);
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarLabelStyle: {
          textTransform: "none",
          fontSize: labelSize,
          padding: 0,
          margin: 0,
        },
        tabBarInactiveTintColor: "rgba(255,255,255,0.3)",
        tabBarIndicatorStyle: {
          height: 3,
          width: indicatorWidth,
          left: indicatorLeft,
          borderRadius: 30,
          backgroundColor: GlobalStyles.colors.purple,
        },
        tabBarStyle: {
          padding: 0,
          margin: 0,
          justifyContent: "center",
          width: "100%",
          elevation: 0,
          backgroundColor: "transparent",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.1)",
        },
        tabBarPressColor: "white",
      }}
    >
      <TopTab.Screen
        name="Posts"
        options={{
          title: "Images",
        }}
      >
        {({ navigation, route }) => (
          <Posts
            navigation={navigation}
            route={route}
            refreshing={refreshing}
          />
        )}
      </TopTab.Screen>
      <TopTab.Screen
        name="Videos"
        options={{
          title: "VIDS",
        }}
      >
        {({ navigation, route }) => (
          <Videos
            navigation={navigation}
            route={route}
            refreshing={refreshing}
          />
        )}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
};

export default ProfileBody;

const styles = StyleSheet.create({});
