import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KULA } from "../../constants/Styles";
import {
  getConnectivitySnapshot,
  subscribeToConnectivityChanges,
} from "../../services/network/connectivityService";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;

    getConnectivitySnapshot()
      .then((snapshot) => {
        if (mounted) {
          setIsOnline(snapshot.isOnline);
        }
      })
      .catch(() => {});

    const unsubscribe = subscribeToConnectivityChanges((state) => {
      if (mounted) {
        setIsOnline(state.isOnline);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>You are offline. Changes will sync when connected.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: KULA.terracotta,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 10,
  },
  bannerText: {
    color: KULA.white,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
