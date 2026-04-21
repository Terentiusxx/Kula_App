import {
  AppState,
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";

import React, { useContext, useEffect, useRef, useState } from "react";
import { GlobalStyles } from "../constants/Styles";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { Ionicons } from "@expo/vector-icons";
import CameraScreen from "./CameraScreen";
import { AuthContext } from "../store/auth-context";
import { getFilename } from "../utils/helperFunctions";
import ProgressOverlay from "../components/ProgressOverlay";
import ErrorOverlay from "../components/ErrorOverlay";
import UploadIcon from "../assets/UploadIcon";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getUiState, upsertUiState } from "../services/localdb/cacheRepository";

const { width, height } = Dimensions.get("window");
const PLACEHOLDER_IMAGE =
  "https://img.freepik.com/free-vector/image-folder-concept-illustration_114360-114.jpg?t=st=1708625623~exp=1708629223~hmac=155af0101788f9a6c147e4a7fa105127a5089c3bf46ded7b7cd2f15de53ec39c&w=740";

function NewPostScreen({ navigation, route }) {
  const authCtx = useContext(AuthContext);
  const [type, setType] = useState();
  const [post, setPost] = useState(null);
  const [resizeModeCover, setResizeModeCover] = useState(true);
  const [showCamera, setShowCamera] = useState(true);
  const [caption, setCaption] = useState("");
  const draftKey = "draft:new_post";
  const draftRef = useRef({ caption: "", post: null, type: null });

  const [uploading, setUploading] = useState({
    status: false,
    progress: 0,
    success: true,
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "New Post",
    });
  }, []);

  useEffect(() => {
    if (route?.params?.type) {
      setType(route?.params?.type);
    }
  }, [route?.params?.type]);

  useEffect(() => {
    draftRef.current = { caption, post, type };
  }, [caption, post, type]);

  useEffect(() => {
    const saved = getUiState(draftKey);
    if (saved.ok && saved.data?.payload) {
      const draft = saved.data.payload;
      setCaption(String(draft.caption || ""));
      setPost(draft.post || null);
      setType(draft.type || type);
      draftRef.current = {
        caption: String(draft.caption || ""),
        post: draft.post || null,
        type: draft.type || type,
      };
    }

    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "background" || state === "inactive") {
        upsertUiState(draftKey, { ...draftRef.current, updatedAt: Date.now() });
      }
    });

    return () => {
      upsertUiState(draftKey, { ...draftRef.current, updatedAt: Date.now() });
      appStateSubscription?.remove?.();
    };
  }, []);
  async function newPostHandler() {
    if (post) {
      const filenameData = getFilename(post);

      const formData = new FormData();
      formData.append("userId", authCtx.userData._id);
      formData.append("description", caption);

      formData.append("picture", {
        uri: post,
        type: "image/" + filenameData.fileType,
        name: filenameData.name,
      });
      formData.append("picturePath", filenameData.name);
      try {
        setUploading((prevData) => {
          return { ...prevData, status: true };
        });
        setTimeout(() => {
          upsertUiState(draftKey, {
            caption: "",
            post: null,
            type: null,
            updatedAt: Date.now(),
          });
          setUploading({ status: false, progress: 0, success: true });
          navigation.goBack();
        }, 3000);
      } catch (error) {
        setUploading((prevData) => {
          return { ...prevData, success: false };
        }),
          console.log(error.message);
      }
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container]}
    >
      <StatusBar backgroundColor={GlobalStyles.colors.primary} />
      <CameraScreen
        showCamera={showCamera}
        setShowCamera={setShowCamera}
        getPost={setPost}
        mode={type === "video" ? type : undefined}
      />
      {!post ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <UploadIcon
            onPress={() => setShowCamera(true)}
            width={GlobalStyles.styles.windowWidth - 50}
            height={height / 2}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <View
            style={{
              width: "100%",
              borderRadius: 40,
              backgroundColor: GlobalStyles.colors.primary300,
              padding: 10,
            }}
          >
            <View
              style={{
                width: "100%",
                height: height / 2,
                backgroundColor: GlobalStyles.colors.primary300,
                borderRadius: 30,
                overflow: "hidden",
              }}
            >
              <ImageBackground
                source={{
                  uri: post,
                }}
                style={{
                  flex: 1,
                }}
                imageStyle={{
                  resizeMode: resizeModeCover ? "cover" : "contain",
                }}
              >
                <Pressable
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    margin: 20,
                  }}
                  onPress={() => {
                    setResizeModeCover(!resizeModeCover);
                  }}
                >
                  <Pressable
                    style={{
                      backgroundColor: "white",
                      borderRadius: 50,
                      padding: 10,
                    }}
                    onPress={() => {
                      setShowCamera(true);
                    }}
                  >
                    <Ionicons
                      name="sync-outline"
                      size={25}
                      color={GlobalStyles.colors.blue}
                    />
                  </Pressable>
                </Pressable>
              </ImageBackground>
            </View>
            <View style={{ marginTop: 10 }}>
              <InputField
                style={{ color: "white" }}
                placeholder="What's on your mind?"
                multiline={true}
                onChangeText={setCaption}
                value={caption}
                inValid={true}
              />
            </View>
          </View>
        </View>
      )}
      <View
        style={{
          padding: 20,
        }}
      >
        <Button title={"Post"} onPress={newPostHandler} />
      </View>
      {uploading.status && (
        <>
          {uploading.success ? (
            <ProgressOverlay
              title={"Uploading"}
              progress={uploading.progress}
            />
          ) : (
            <ErrorOverlay
              message={"Uploading Failed"}
              onClose={() => {
                setUploading({ status: false, progress: 0, success: true });
              }}
            />
          )}
        </>
      )}
    </KeyboardAvoidingView>
  );
}

export default NewPostScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.primary,
    flex: 1,
  },
});
