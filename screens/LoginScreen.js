import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import LoginForm from "../components/loginScreen/LoginForm";
import { GlobalStyles } from "../constants/Styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      {/* Header area */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="aperture-outline" size={36} color="#7A40F8" />
        </View>
        <Text style={styles.welcomeText}>Welcome back</Text>
        <Text style={styles.subtitleText}>
          Sign in to continue to your account
        </Text>
      </View>

      {/* Form card */}
      <View style={styles.card}>
        <LoginForm navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
  },
  blobTopRight: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(122, 64, 248, 0.10)",
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(107, 176, 245, 0.12)",
  },
  header: {
    alignItems: "center",
    marginTop: height * 0.08,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#EDE9FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#7A40F8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1A1A2E",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 15,
    color: "#7A7A9D",
    letterSpacing: 0.1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 20,
    shadowColor: "#7A40F8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 8,
  },
});
