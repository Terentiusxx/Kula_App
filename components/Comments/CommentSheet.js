import React, { useRef, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";
import CommentCard from "./CommentCard";
import { GlobalStyles } from "../../constants/Styles";
import { FlatList } from "react-native-gesture-handler";
import InputField from "../InputField";
import EmojiInput from "../UI/EmojiInput";

function CommentSheet({ visible, setVisible, comments = [] }) {
  const [comment, setComment] = useState("");
  const actionSheetRef = useRef(null);
  useEffect(() => {
    if (visible) {
      actionSheetRef.current?.setModalVisible(true);
    } else {
      actionSheetRef.current?.setModalVisible(false);
    }
  }, [visible]);

  const normalizedComments = (comments || []).map((item, index) => ({
    _id: String(item?._id || item?.id || "comment_" + index),
    author: {
      name: item?.author?.name || item?.authorName || "Community Member",
      picturePath:
        item?.author?.picturePath ||
        item?.authorPicturePath ||
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
    text: item?.text || item?.message || "",
    time: item?.time || "just now",
  }));

  return (
    <View style={{ flex: 1 }}>
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{
          backgroundColor: GlobalStyles.colors.primary,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        indicatorStyle={{
          width: 50,
          marginVertical: 10,
          backgroundColor: "white",
        }}
        gestureEnabled={true}
        onClose={() => {
          setVisible();
        }}
      >
        <FlatList
          keyExtractor={(item) => item._id}
          data={normalizedComments}
          renderItem={({ item, index }) => {
            return <CommentCard comment={item} />;
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          {/* <View style={{ flex: 1, marginVertical: 10 }}>
            <InputField
              onChangeText={setComment}
              value={comment}
              placeholder="Type Somthing"
              keyboardType="default"
              inValid={true}
            />
          </View>
          <View
            style={{
              backgroundColor: "rgba(122, 64, 248,0.5)",
              padding: 10,
              borderRadius: 50,
              marginLeft: 10,
            }}
          >
            <Ionicons name="send" color={"white"} size={30} />
          </View> */}
          <EmojiInput />
        </View>
      </ActionSheet>
    </View>
  );
}

export default CommentSheet;
