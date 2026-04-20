import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import NotificationCard from "../components/notificationScreen/NotificationCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_NOTIFICATIONS } from "../data/mockData";
import { KULA } from "../constants/Styles";

const NotificationsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={"#FAF3E0"} />
      <Text style={styles.heading}>Notifications</Text>
      <FlatList
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
        renderItem={({ item }) => <NotificationCard notification={item} />}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF3E0" },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: KULA.brown,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
  },
});
