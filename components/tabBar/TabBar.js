import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { View, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { GlobalStyles } from "../../constants/Styles";
import TabBarSvg from "./TabBarSvg";
import NewPostIcon from "./NewPostIcon";
import { AppContext } from "../../store/app-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTabBarMetrics } from "./tabBarMetrics";

const TabBar = ({ state, descriptors, navigation }) => {
  const appCtx = useContext(AppContext);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const iconByRoute = {
    HomeScreen: "home-outline",
    DiscoverScreen: "search-outline",
    EventsScreen: "calendar-outline",
    MessagesScreen: "chatbubble-ellipses-outline",
    UserProfileScreen: "person-outline",
    SettingsScreen: "settings-outline",
  };
  const [tabBarHeight, setTabBarHeight] = useState(74);
  const [actionBtnPressed, setActionBtnPressed] = useState(false);
  const metrics = getTabBarMetrics(width);
  const centerButtonSize = metrics.buttonDiameter;
  const centerOffset = metrics.notchDepth - metrics.buttonRadius;
  const bottomInsetPadding = Math.max(12, (insets.bottom || 0) + 2);

  const activeTabScreen = state.routes[state.index].name;
  const shouldBlockScreenWithOverlay =
    actionBtnPressed && activeTabScreen !== "DiscoverScreen";

  useEffect(() => {
    if (activeTabScreen === "DiscoverScreen" && actionBtnPressed) {
      setActionBtnPressed(false);
    }
  }, [activeTabScreen, actionBtnPressed]);

  return (
    <Fragment>
      {shouldBlockScreenWithOverlay && (
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Pressable
            onPress={() => setActionBtnPressed(false)}
            style={{
              flex: 1,
              backgroundColor: "rgba(251,243,224,0.85)",
            }}
          />
        </Animated.View>
      )}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          elevation: 1,
        }}
      >
        <TabBarSvg
          width={width}
          height={tabBarHeight}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: Math.max(12, width * 0.04),
          paddingTop: 6,
          paddingBottom: bottomInsetPadding,
          backgroundColor: "transparent",
          position: "absolute",
          bottom: 0,
          zIndex: 20,
          elevation: 3,
        }}
        onLayout={(e) => {
          setTabBarHeight(e.nativeEvent.layout.height);
          appCtx.setTabBarHeight(e.nativeEvent.layout.height + centerButtonSize * 0.5 + 16);
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });
            if (actionBtnPressed) {
              setActionBtnPressed(false);
            }
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const animatedStyles = useAnimatedStyle(() => {
            return {
              transform: [
                { translateX: isFocused ? withTiming(-10) : withTiming(0) },
                { translateY: isFocused ? withTiming(-6) : withTiming(0) },
              ],
            };
          });
          const animatedFocusedOpacity = useAnimatedStyle(() => {
            return {
              opacity: isFocused ? withTiming(1) : withTiming(0),
            };
          });
          const animatedUnfocusedOpacity = useAnimatedStyle(() => {
            return {
              opacity: isFocused ? withTiming(0) : withTiming(1),
            };
          });
          const iconName = iconByRoute[route.name];
          if (!iconName) return null;

          return (
            <Fragment key={index}>
              <View style={{ flex: 1 }}>
                <Pressable onPress={onPress}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                      paddingVertical: 12,
                    }}
                  >
                    <Animated.View
                      style={[
                        {
                          position: "absolute",
                          overflow: "visible",
                        },
                        animatedFocusedOpacity,
                      ]}
                    >
                      <Ionicons
                        name={iconName}
                        size={metrics.iconSize}
                        color={"#1D9E75"}
                      />
                    </Animated.View>
                    <Animated.View
                      style={[
                        {
                        },
                        animatedUnfocusedOpacity,
                        animatedStyles,
                      ]}
                    >
                      <Ionicons
                        name={iconName}
                        size={metrics.iconSize}
                        color={"rgba(59,42,26,0.35)"}
                      />
                    </Animated.View>
                  </View>
                </Pressable>
              </View>
              {index == 1 && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 30,
                    elevation: 4,
                  }}
                >
                  <View
                    style={{
                      transform: [{ translateY: -centerOffset }],
                    }}
                  >
                    <NewPostIcon
                      size={centerButtonSize}
                      buttonRadius={metrics.buttonRadius}
                      exploreActive={activeTabScreen === "DiscoverScreen"}
                      pressed={actionBtnPressed}
                      setPressed={setActionBtnPressed}
                    />
                  </View>
                </View>
              )}
            </Fragment>
          );
        })}
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({});

export default TabBar;
