import {
  Dimensions,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Validator from "email-validator";
import React, { useRef, useState } from "react";
import { GlobalStyles } from "../constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import PressEffect from "./UI/PressEffect";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

const { height, width } = Dimensions.get("window");

const InputField = ({
  onChangeText,
  onBlur,
  onFocus,
  value,
  placeholder,
  keyboardType,
  textContentType,
  inValid,
  search,
  autoFocus,
  multiline,
  containerStyle,
  lightTheme,
  secureTextEntry,
}) => {
  const txtRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.inputField,
        lightTheme && styles.inputFieldLight,
        {
          borderColor: inValid
            ? lightTheme ? GlobalStyles.colors.border : GlobalStyles.colors.primary500
            : GlobalStyles.colors.red,
        },
        containerStyle,
        isFocused && {
          borderWidth: 1.5,
          borderColor: lightTheme ? GlobalStyles.colors.teal : GlobalStyles.colors.purple,
        },
      ]}
    >
      {search && (
        <View style={{ marginHorizontal: 5 }}>
          <Ionicons
            name="search-outline"
            size={25}
            color={GlobalStyles.colors.purple}
          />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <TextInput
          style={{ color: lightTheme ? GlobalStyles.colors.brown : "white" }}
          ref={txtRef}
          placeholderTextColor={lightTheme ? GlobalStyles.colors.muted : "#bdbdbd"}
          autoCapitalize="none"
          placeholder={placeholder}
          keyboardType={keyboardType}
          textContentType={textContentType}
          onChangeText={onChangeText}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus && onFocus(e);
          }}
          value={value}
          autoFocus={autoFocus}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
        />
      </View>

      {search && isFocused && (
        <PressEffect>
          <Animated.View
            entering={ZoomIn}
            exiting={ZoomOut}
            onTouchEnd={() => {
              onChangeText("");
              if (txtRef.current) {
                txtRef.current.blur();
              }
            }}
            style={{
              marginHorizontal: 5,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Ionicons
              name="close"
              size={25}
              color={GlobalStyles.colors.purple}
            />
          </Animated.View>
        </PressEffect>
      )}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary500,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary500,
    padding: 15,
  },
  inputFieldLight: {
    backgroundColor: GlobalStyles.colors.primary600,
    borderColor: GlobalStyles.colors.border,
  },
});
