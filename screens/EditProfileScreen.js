import { AppState, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { DEFAULT_DP, GlobalStyles } from "../constants/Styles";
import { Image } from "react-native";
import { AuthContext } from "../store/auth-context";
import CameraScreen from "./CameraScreen";
import { getFilename } from "../utils/helperFunctions";
import ProgressOverlay from "../components/ProgressOverlay";
import ErrorOverlay from "../components/ErrorOverlay";
import PressEffect from "../components/UI/PressEffect";
import { getUiState, upsertUiState } from "../services/localdb/cacheRepository";

const EditProfileScreen = ({ navigation, route }) => {
  const authCtx = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [userData, setUserData] = useState({
    fullName: authCtx.userData.fullName,
    username: authCtx.userData.username,
    bio: authCtx.userData.bio,
    email: authCtx.userData.email,
    password: "",
    friends: "",
    picturePath: "",
    occupation: authCtx.userData.occupation,
  });
  const [uploading, setUploading] = useState({
    status: false,
    progress: 0,
    success: true,
  });
  const draftKey = "draft:edit_profile";
  const draftRef = useRef({ profilePic: "", userData: {} });

  async function updateBtnHandler() {
    const filenameData = getFilename(profilePic);

    const formData = new FormData();
    formData.append("_id", authCtx.userData._id);
    formData.append("username", userData.username);
    formData.append("fullName", userData.fullName);
    formData.append("email", userData.email);
    formData.append("occupation", userData.occupation);
    formData.append("bio", userData.bio);
    if (!!profilePic) {
      formData.append("picture", {
        uri: profilePic,
        type: "image/" + filenameData.fileType,
        name: filenameData.name,
      });
      formData.append("picturePath", filenameData.name);
    }
    try {
      setUploading((prevData) => {
        return { ...prevData, status: true };
      });
      setTimeout(() => {
        upsertUiState(draftKey, {
          profilePic: "",
          userData: {
            fullName: userData.fullName,
            username: userData.username,
            bio: userData.bio,
            email: userData.email,
            occupation: userData.occupation,
          },
          updatedAt: Date.now(),
        });
        setUploading({ status: false, progress: 0, success: true });
        navigation.goBack();
      }, 3000);
    } catch (error) {
      setUploading((prevData) => {
        return { ...prevData, success: false };
      });
      console.log(error.message);
    }
  }
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Edit Profile",
    });
  }, []);

  useEffect(() => {
    draftRef.current = { profilePic, userData };
  }, [profilePic, userData]);

  useEffect(() => {
    const saved = getUiState(draftKey);
    if (saved.ok && saved.data?.payload) {
      const draft = saved.data.payload;
      if (draft.profilePic) {
        setProfilePic(draft.profilePic);
      }
      if (draft.userData) {
        setUserData((prev) => ({ ...prev, ...draft.userData }));
      }
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
  return (
    <View style={styles.container}>
      <CameraScreen
        showCamera={showCamera}
        setShowCamera={setShowCamera}
        getPost={setProfilePic}
        mode={"profilePic"}
      />
      <ScrollView
        contentContainerStyle={{
          marginHorizontal: 15,
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View>
            <PressEffect>
              <Pressable
                onPress={() => {
                  setShowCamera(true);
                }}
              >
                <Image
                  source={{
                    uri: !!profilePic ? profilePic : DEFAULT_DP,
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    resizeMode: "cover",
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    padding: 6,
                    backgroundColor: "#1D9E75",
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: "#FAF3E0",
                  }}
                >
                  <Image
                    source={require("../assets/edit.png")}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: "cover",
                      tintColor: "white",
                    }}
                  />
                </View>
              </Pressable>
            </PressEffect>
          </View>
        </View>
              {/* All InputFields use lightTheme for the cream background */}
        <Text style={styles.title}>Full Name</Text>
        <InputField
          placeholder="John Doe"
          keyboardType="default"
          onChangeText={(text) => setUserData((p) => ({ ...p, fullName: text }))}
          value={userData.fullName}
          inValid={true}
          lightTheme
        />

        <Text style={styles.title}>Username</Text>
        <InputField
          placeholder="username"
          keyboardType="default"
          onChangeText={(text) => setUserData((p) => ({ ...p, username: text }))}
          value={userData.username}
          inValid={true}
          lightTheme
        />

        <Text style={styles.title}>Email</Text>
        <InputField
          placeholder="email@example.com"
          keyboardType="email-address"
          onChangeText={(text) => setUserData((p) => ({ ...p, email: text }))}
          value={userData.email}
          inValid={true}
          lightTheme
        />

        <Text style={styles.title}>Occupation</Text>
        <InputField
          placeholder="e.g. Designer"
          keyboardType="default"
          onChangeText={(text) => setUserData((p) => ({ ...p, occupation: text }))}
          value={userData.occupation}
          inValid={true}
          lightTheme
        />

        <Text style={styles.title}>Bio</Text>
        <InputField
          placeholder="Tell people about yourself"
          keyboardType="default"
          onChangeText={(text) => setUserData((p) => ({ ...p, bio: text }))}
          value={userData.bio}
          inValid={true}
          multiline={true}
          lightTheme
        />
      </ScrollView>
      <View style={{ margin: 10 }}>
        <Button title={"Update"} onPress={updateBtnHandler} />
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
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A4A6A",
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.3,
  },
});
