import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import SignupForm from "../components/signupScreen/SignupForm";
import { SafeAreaView } from "react-native-safe-area-context";
import { KULA } from "../constants/Styles";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const SignupScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="people-outline" size={34} color={KULA.terracotta} />
        </View>
        <Text style={styles.heading}>Join KULA</Text>
        <Text style={styles.subtitle}>Create your account and find your community</Text>
      </View>

      {/* Form card */}
      <View style={styles.card}>
        <SignupForm navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KULA.cream,
  },
  blobTopRight: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(193,96,58,0.09)",
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(29,158,117,0.09)",
  },
  header: {
    alignItems: "center",
    marginTop: height * 0.06,
    marginBottom: 28,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: "#FDEEE6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: KULA.terracotta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: KULA.brown,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: KULA.muted,
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: KULA.white,
    marginHorizontal: 20,
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 20,
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 24,
    elevation: 6,
  },
});
