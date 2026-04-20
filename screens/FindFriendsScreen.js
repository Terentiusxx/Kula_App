import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { KULA } from "../constants/Styles";
import FAB from "../components/UI/FAB";
import { useNavigation } from "@react-navigation/native";

// ── Mock data ──────────────────────────────────────────────────────────────────
const FILTERS = ["New Arrivals", "Same Country", "Same Interests", "Nearby"];

const FIND_FRIENDS = [
  {
    _id: "ff1",
    fullName: "Kwame Osei",
    originCountry: "Ghana",
    originFlag: "🇬🇭",
    currentCity: "Accra",
    picturePath: "https://i.pravatar.cc/200?img=8",
    interests: ["Food", "Music"],
    contextLine: "Both in the Tech community",
    isOnline: true,
  },
  {
    _id: "ff2",
    fullName: "Amina Hassan",
    originCountry: "Kenya",
    originFlag: "🇰🇪",
    currentCity: "Accra",
    picturePath: "https://i.pravatar.cc/200?img=29",
    interests: ["Art", "Language Exchange"],
    contextLine: "Also new to Accra",
    isOnline: true,
  },
  {
    _id: "ff3",
    fullName: "Fatima Al-Rashid",
    originCountry: "Lebanon",
    originFlag: "🇱🇧",
    currentCity: "Accra",
    picturePath: "https://i.pravatar.cc/200?img=23",
    interests: ["Food", "Cooking"],
    contextLine: "Shared interest: Cooking",
    isOnline: false,
  },
  {
    _id: "ff4",
    fullName: "Yuki Tanaka",
    originCountry: "Japan",
    originFlag: "🇯🇵",
    currentCity: "Accra",
    picturePath: "https://i.pravatar.cc/200?img=36",
    interests: ["Language Exchange", "Art"],
    contextLine: "Both learning Twi",
    isOnline: true,
  },
];

// ── Person card ────────────────────────────────────────────────────────────────
function PersonCard({ person }) {
  const navigation = useNavigation();
  return (
    <View style={styles.personCard}>
      {/* Top: avatar + info */}
      <View style={styles.personTop}>
        <Image source={{ uri: person.picturePath }} style={styles.avatar} />
        <View style={styles.personInfo}>
          <Text style={styles.personName}>{person.fullName}</Text>
          <Text style={styles.personCountry}>
            {person.originFlag} {person.originCountry}
          </Text>
          <Text style={styles.personCity}>{person.currentCity}</Text>
        </View>
      </View>

      {/* Middle: online indicator + interest tags */}
      <View style={styles.tagsRow}>
        {person.isOnline && <View style={styles.onlineIndicator} />}
        {person.interests.map((interest) => (
          <View key={interest} style={styles.interestTag}>
            <Text style={styles.interestTagText}>{interest}</Text>
          </View>
        ))}
      </View>

      {/* Context line */}
      <Text style={styles.contextLine}>{person.contextLine}</Text>

      {/* Action buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.waveBtn} activeOpacity={0.75}>
          <Text style={styles.waveBtnText}>Wave</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => navigation.navigate("UserProfileScreen")}
          activeOpacity={0.85}
        >
          <Text style={styles.profileBtnText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Find Friends Screen ────────────────────────────────────────────────────────
export default function FindFriendsScreen() {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState("New Arrivals");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={KULA.cream} />

      <FlatList
        data={FIND_FRIENDS}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.heading}>Find Friends</Text>
            </View>

            {/* Filter pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersRow}
            >
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterPill, selectedFilter === f && styles.filterPillActive]}
                  onPress={() => setSelectedFilter(f)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilter === f && styles.filterTextActive,
                    ]}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={{ height: 16 }} />
          </>
        )}
        renderItem={({ item }) => <PersonCard person={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />

      <FAB onPress={() => navigation.navigate("DiscoverScreen")} icon="compass-outline" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: KULA.cream },
  listContent: { paddingHorizontal: 20, paddingBottom: 120 },

  header: { paddingTop: 14, paddingBottom: 4 },
  heading: { fontSize: 26, fontWeight: "800", color: KULA.brown },

  filtersRow: { gap: 8, paddingBottom: 4 },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: KULA.white,
    borderWidth: 1,
    borderColor: KULA.border,
  },
  filterPillActive: { backgroundColor: KULA.teal, borderColor: KULA.teal },
  filterText: { fontSize: 14, fontWeight: "600", color: KULA.brown },
  filterTextActive: { color: KULA.white },

  // Person card
  personCard: {
    backgroundColor: KULA.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  personTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover",
    backgroundColor: KULA.border,
    marginRight: 14,
  },
  personInfo: { flex: 1, justifyContent: "center" },
  personName: { fontSize: 17, fontWeight: "700", color: KULA.brown, marginBottom: 3 },
  personCountry: { fontSize: 14, color: KULA.muted, marginBottom: 2 },
  personCity: { fontSize: 13, color: KULA.muted },

  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  onlineIndicator: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: KULA.teal,
  },
  interestTag: {
    backgroundColor: KULA.cream,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  interestTagText: { fontSize: 12, color: KULA.brown, fontWeight: "500" },

  contextLine: {
    fontSize: 13,
    color: KULA.teal,
    fontWeight: "600",
    marginBottom: 14,
  },

  actionsRow: { flexDirection: "row", gap: 10 },
  waveBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: KULA.teal,
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: "center",
  },
  waveBtnText: { fontSize: 15, fontWeight: "600", color: KULA.teal },
  profileBtn: {
    flex: 1,
    backgroundColor: KULA.teal,
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: "center",
  },
  profileBtnText: { fontSize: 15, fontWeight: "600", color: KULA.white },
});
