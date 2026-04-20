import React from "react";
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
const CUISINES = [
  {
    _id: "c1",
    name: "Ghanaian",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80",
  },
  {
    _id: "c2",
    name: "Nigerian",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80",
  },
  {
    _id: "c3",
    name: "Ethiopian",
    image: "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?w=300&q=80",
  },
  {
    _id: "c4",
    name: "Lebanese",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&q=80",
  },
  {
    _id: "c5",
    name: "Indian",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80",
  },
  {
    _id: "c6",
    name: "Japanese",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80",
  },
];

const RESTAURANTS = [
  {
    _id: "r1",
    name: "Azmera Restaurant",
    cuisine: "Ethiopian",
    rating: 4.7,
    reviewCount: 142,
    distance: "1.2 km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?w=800&q=80",
  },
  {
    _id: "r2",
    name: "Buka West African Kitchen",
    cuisine: "Ghanaian · Nigerian",
    rating: 4.5,
    reviewCount: 89,
    distance: "0.7 km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
  },
  {
    _id: "r3",
    name: "Mama Oliech",
    cuisine: "Kenyan",
    rating: 4.3,
    reviewCount: 234,
    distance: "2.3 km",
    isOpen: false,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  },
];

// ── Restaurant card ────────────────────────────────────────────────────────────
function RestaurantCard({ restaurant }) {
  return (
    <TouchableOpacity style={styles.restaurantCard} activeOpacity={0.9}>
      <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantTopRow}>
          <View style={styles.restaurantMeta}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
            <View style={styles.restaurantStats}>
              <Ionicons name="star" size={13} color={KULA.gold} />
              <Text style={styles.restaurantRating}>
                {restaurant.rating}{" "}
                <Text style={styles.restaurantReviews}>({restaurant.reviewCount})</Text>
              </Text>
              <Text style={styles.dot}>·</Text>
              <Ionicons name="location-outline" size={13} color={KULA.muted} />
              <Text style={styles.restaurantDistance}>{restaurant.distance}</Text>
            </View>
          </View>
          <View
            style={[
              styles.openBadge,
              { backgroundColor: restaurant.isOpen ? KULA.teal : KULA.muted },
            ]}
          >
            <Text style={styles.openBadgeText}>
              {restaurant.isOpen ? "Open" : "Closed"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Food & Culture Screen ──────────────────────────────────────────────────────
export default function FoodCultureScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={KULA.cream} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Food & Culture</Text>
          <Text style={styles.subtitle}>Discover authentic flavors from around the world</Text>
        </View>

        {/* Explore Cuisines */}
        <Text style={styles.sectionTitle}>Explore Cuisines</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cuisinesRow}
        >
          {CUISINES.map((cuisine) => (
            <TouchableOpacity key={cuisine._id} style={styles.cuisineCard} activeOpacity={0.8}>
              <Image source={{ uri: cuisine.image }} style={styles.cuisineImage} />
              <Text style={styles.cuisineName}>{cuisine.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Nearby Restaurants */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Nearby Restaurants</Text>

        <View style={styles.restaurantsList}>
          {RESTAURANTS.map((r) => (
            <RestaurantCard key={r._id} restaurant={r} />
          ))}
        </View>
      </ScrollView>

      <FAB onPress={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: KULA.cream },
  scrollContent: { paddingBottom: 120 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: KULA.border,
    marginBottom: 20,
    backgroundColor: KULA.white,
  },
  heading: { fontSize: 26, fontWeight: "800", color: KULA.brown, marginBottom: 4 },
  subtitle: { fontSize: 14, color: KULA.muted },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: KULA.brown,
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  // Cuisines
  cuisinesRow: { gap: 14, paddingHorizontal: 20, paddingBottom: 4 },
  cuisineCard: { alignItems: "center", width: 120 },
  cuisineImage: {
    width: 120,
    height: 100,
    borderRadius: 14,
    resizeMode: "cover",
    marginBottom: 8,
    backgroundColor: KULA.border,
  },
  cuisineName: { fontSize: 14, fontWeight: "600", color: KULA.brown },

  // Restaurants
  restaurantsList: { paddingHorizontal: 20, gap: 16 },
  restaurantCard: {
    backgroundColor: KULA.white,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  restaurantImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    backgroundColor: KULA.border,
  },
  restaurantInfo: { padding: 14 },
  restaurantTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  restaurantMeta: { flex: 1, marginRight: 12 },
  restaurantName: { fontSize: 18, fontWeight: "700", color: KULA.brown, marginBottom: 2 },
  restaurantCuisine: { fontSize: 13, color: KULA.muted, marginBottom: 6 },
  restaurantStats: { flexDirection: "row", alignItems: "center", gap: 4 },
  restaurantRating: { fontSize: 13, color: KULA.brown, fontWeight: "600" },
  restaurantReviews: { fontWeight: "400", color: KULA.muted },
  dot: { color: KULA.muted, marginHorizontal: 2 },
  restaurantDistance: { fontSize: 13, color: KULA.muted },
  openBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
  },
  openBadgeText: { fontSize: 13, fontWeight: "600", color: KULA.white },
});
