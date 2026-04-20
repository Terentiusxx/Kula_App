import { StyleSheet } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Feed from "./Feed";
import Video from "./Video";

const TopTab = createMaterialTopTabNavigator();

const Body = ({ StoryTranslate }) => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#3B2A1A",
        tabBarLabelStyle: {
          textTransform: "none",
          fontSize: 16,
          fontWeight: "700",
          padding: 0,
          margin: 0,
        },
        tabBarInactiveTintColor: "rgba(59,42,26,0.35)",
        tabBarIndicatorStyle: {
          height: 3,
          width: "10%",
          left: "20%",
          borderRadius: 30,
          backgroundColor: "#1D9E75",
        },
        tabBarStyle: {
          padding: 0,
          margin: 0,
          justifyContent: "center",
          width: "100%",
          elevation: 0,
          backgroundColor: "transparent",
          borderBottomWidth: 1,
          borderBottomColor: "#EDE8DC",
        },
        tabBarPressColor: "#1D9E75",
      }}
    >
      <TopTab.Screen name="Feed">
        {() => <Feed StoryTranslate={StoryTranslate} />}
      </TopTab.Screen>
      <TopTab.Screen name="Video">
        {() => <Video StoryTranslate={StoryTranslate} />}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
};

export default Body;

const styles = StyleSheet.create({});
