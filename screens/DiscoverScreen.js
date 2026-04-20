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
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { KULA } from "../constants/Styles";
import FAB from "../components/UI/FAB";
import { useNavigation } from "@react-navigation/native";

// ── Mock data ──────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "People", "Events", "Food", "Communities"];

const DISCOVER_ITEMS = [
  {
    _id: "d1",
    title: "Jollof Rice Festival",
    category: "Food",
    distance: "1.2 km",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80",
  },
  {
    _id: "d2",
    title: "Tech Newcomers Accra",
    category: "Community",
    distance: "0.5 km",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=80",
  },
  {
    _id: "d3",
    title: "Mama Oliech Restaurant",
    category: "Food",
    distance: "2.3 km",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80",
  },
  {
    _id: "d4",
    title: "Language Exchange Meetup",
    category: "Event",
    distance: "0.8 km",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&q=80",
  },
  {
    _id: "d5",
    title: "Kofi Asante",
    category: "People",
    distance: "1.0 km",
    image: "https://i.pravatar.cc/200?img=12",
  },
  {
    _id: "d6",
    title: "Accra Music Scene",
    category: "Community",
    distance: "3.1 km",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=80",
  },
];

const CATEGORY_COLORS = {
  Food: "#FDEEE6",
  Event: "#E8F5EE",
  Community: "#EEF0FF",
  People: "#FEF9E8",
};

const CATEGORY_TEXT = {
  Food: KULA.terracotta,
  Event: KULA.teal,
  Community: "#7A6FDC",
  People: KULA.gold,
};

// ── Result row ─────────────────────────────────────────────────────────────────
function DiscoverRow({ item }) {
  const bgColor = CATEGORY_COLORS[item.category] ?? KULA.cream;
  const textColor = CATEGORY_TEXT[item.category] ?? KULA.brown;

  return (
    <TouchableOpacity style={styles.resultRow} activeOpacity={0.75}>
      <Image source={{ uri: item.image }} style={styles.resultThumb} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <View style={[styles.resultBadge, { backgroundColor: bgColor }]}>
          <Text style={[styles.resultBadgeText, { color: textColor }]}>
            {item.category}
          </Text>
        </View>
        <View style={styles.resultLocation}>
          <Ionicons name="location-outline" size={12} color={KULA.muted} />
          <Text style={styles.resultDistance}>{item.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Discover Screen ────────────────────────────────────────────────────────────
export default function DiscoverScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [viewMode, setViewMode] = useState("list");

  const filtered = DISCOVER_ITEMS.filter((item) => {
    const matchesCat =
      selectedCat === "All" ||
      item.category.toLowerCase() === selectedCat.toLowerCase() ||
      (selectedCat === "Communities" && item.category === "Community");
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={KULA.cream} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <>
            {/* Title */}
            <View style={styles.header}>
              <Text style={styles.heading}>Discover</Text>
            </View>

            {/* Search bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color={KULA.muted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search people, events, food..."
                placeholderTextColor={KULA.muted}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Category pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesRow}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catPill, selectedCat === cat && styles.catPillActive]}
                  onPress={() => setSelectedCat(cat)}
                >
                  <Text
                    style={[
                      styles.catPillText,
                      selectedCat === cat && styles.catPillTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* List / Map toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, viewMode === "list" && styles.toggleBtnActive]}
                onPress={() => setViewMode("list")}
              >
                <Ionicons
                  name="list-outline"
                  size={15}
                  color={viewMode === "list" ? KULA.white : KULA.brown}
                />
                <Text
                  style={[
                    styles.toggleText,
                    viewMode === "list" && styles.toggleTextActive,
                  ]}
                >
                  List
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, viewMode === "map" && styles.toggleBtnActive]}
                onPress={() => setViewMode("map")}
              >
                <Ionicons
                  name="map-outline"
                  size={15}
                  color={viewMode === "map" ? KULA.white : KULA.brown}
                />
                <Text
                  style={[
                    styles.toggleText,
                    viewMode === "map" && styles.toggleTextActive,
                  ]}
                >
                  Map
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 8 }} />
          </>
        )}
        renderItem={({ item, index }) => (
          <View>
            <DiscoverRow item={item} />
            {index < filtered.length - 1 && <View style={styles.divider} />}
          </View>
        )}
      />

      <FAB onPress={() => navigation.navigate("FindFriendsScreen")} icon="people-outline" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: KULA.cream },
  listContent: { paddingBottom: 120 },

  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14 },
  heading: { fontSize: 26, fontWeight: "800", color: KULA.brown },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: KULA.white,
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: KULA.brown },

  categoriesRow: { gap: 8, paddingHorizontal: 20, paddingBottom: 16 },
  catPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: KULA.white,
    borderWidth: 1,
    borderColor: KULA.border,
  },
  catPillActive: { backgroundColor: KULA.teal, borderColor: KULA.teal },
  catPillText: { fontSize: 14, fontWeight: "600", color: KULA.brown },
  catPillTextActive: { color: KULA.white },

  toggleRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: KULA.white,
    borderRadius: 50,
    padding: 4,
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 50,
    gap: 6,
  },
  toggleBtnActive: { backgroundColor: KULA.teal },
  toggleText: { fontSize: 14, fontWeight: "600", color: KULA.brown },
  toggleTextActive: { color: KULA.white },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: KULA.white,
    gap: 14,
  },
  resultThumb: {
    width: 80,
    height: 80,
    borderRadius: 14,
    resizeMode: "cover",
    backgroundColor: KULA.border,
  },
  resultInfo: { flex: 1, gap: 6 },
  resultTitle: { fontSize: 16, fontWeight: "700", color: KULA.brown },
  resultBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 50,
  },
  resultBadgeText: { fontSize: 12, fontWeight: "600" },
  resultLocation: { flexDirection: "row", alignItems: "center", gap: 4 },
  resultDistance: { fontSize: 12, color: KULA.muted },
  divider: { height: 1, backgroundColor: KULA.border, marginLeft: 114 },
});
