import React, {useContext, useEffect, useState} from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {KULA} from "../constants/Styles";
import {AuthContext} from "../store/auth-context";
import {getUiState, upsertUiState} from "../services/localdb/cacheRepository";

const SETTINGS_STATE_KEY = "settings:preferences";

const DEFAULT_SETTINGS = {
  pushNotifications: true,
  inAppNotifications: true,
  profileVisibility: true,
};

function SettingsRow({label, value, onValueChange}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowText}>{label}</Text>
      <Switch
        value={Boolean(value)}
        onValueChange={onValueChange}
        thumbColor={KULA.white}
        trackColor={{false: "#D8D8D8", true: KULA.teal}}
      />
    </View>
  );
}

function PlaceholderRow({label, onPress}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.rowText}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={KULA.muted} />
    </Pressable>
  );
}

export default function SettingsScreen({navigation}) {
  const authCtx = useContext(AuthContext);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Settings",
    });
  }, [navigation]);

  useEffect(() => {
    const result = getUiState(SETTINGS_STATE_KEY);
    if (result.ok && result.data?.payload) {
      setSettings((prev) => ({...prev, ...result.data.payload}));
    }
  }, []);

  function updateSetting(key, value) {
    const next = {...settings, [key]: Boolean(value)};
    setSettings(next);
    upsertUiState(SETTINGS_STATE_KEY, next);
  }

  function showComingSoon(itemLabel) {
    Alert.alert("Coming soon", itemLabel + " settings will be added next.");
  }

  function confirmLogout() {
    if (isLoggingOut) {
      return;
    }
    Alert.alert("Log out", "Are you sure you want to log out?", [
      {text: "Cancel", style: "cancel"},
      {
        text: "Log out",
        style: "destructive",
        onPress: handleLogout,
      },
    ]);
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    const result = await authCtx.logout();
    setIsLoggingOut(false);
    if (!result.ok) {
      Alert.alert("Log out failed", result.error?.message || "Please try again.");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.card}>
        <PlaceholderRow
          label="Edit profile"
          onPress={() => navigation.navigate("EditProfileScreen")}
        />
        <PlaceholderRow
          label="Change password"
          onPress={() => showComingSoon("Change password")}
        />
      </View>

      <Text style={styles.sectionTitle}>Privacy</Text>
      <View style={styles.card}>
        <SettingsRow
          label="Profile visibility"
          value={settings.profileVisibility}
          onValueChange={(value) => updateSetting("profileVisibility", value)}
        />
        <PlaceholderRow
          label="Blocked users"
          onPress={() => showComingSoon("Blocked users")}
        />
      </View>

      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.card}>
        <SettingsRow
          label="Push notifications"
          value={settings.pushNotifications}
          onValueChange={(value) => updateSetting("pushNotifications", value)}
        />
        <SettingsRow
          label="In-app notifications"
          value={settings.inAppNotifications}
          onValueChange={(value) => updateSetting("inAppNotifications", value)}
        />
      </View>

      <Text style={styles.sectionTitle}>Danger Zone</Text>
      <Pressable
        style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
        onPress={confirmLogout}
        disabled={isLoggingOut}
      >
        <Ionicons name="log-out-outline" size={18} color={KULA.white} />
        <Text style={styles.logoutText}>
          {isLoggingOut ? "Logging out..." : "Log out"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KULA.cream,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: KULA.brown,
    marginTop: 14,
    marginBottom: 8,
  },
  card: {
    backgroundColor: KULA.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: KULA.border,
    overflow: "hidden",
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: KULA.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowText: {
    color: KULA.brown,
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: KULA.terracotta,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutText: {
    color: KULA.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
