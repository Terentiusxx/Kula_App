import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { KULA } from "../constants/Styles";
import FAB from "../components/UI/FAB";
import { useNavigation } from "@react-navigation/native";

// ── Mock data ──────────────────────────────────────────────────────────────────
const DAYS = [
  { day: "Mon", date: 10 },
  { day: "Tue", date: 11 },
  { day: "Wed", date: 12 },
  { day: "Thu", date: 13 },
  { day: "Fri", date: 14 },
  { day: "Sat", date: 15 },
  { day: "Sun", date: 16 },
];

const CATEGORIES = ["All", "Food", "Cultural", "Language", "Sports", "Tech"];

const EVENTS = [
  {
    _id: "e1",
    title: "West African Cooking Class",
    organiser: "Mama Esi",
    organiserPic: "https://i.pravatar.cc/100?img=47",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
    category: "Food",
    time: "Today at 6:00 PM",
    location: "Osu, Accra",
    attendeeCount: 18,
    socialProof:
      "Kofi, Sarah, Ahmed, Yuki and 14 others from your community are going",
  },
  {
    _id: "e2",
    title: "Jollof Rice Festival",
    organiser: "Community Kitchen",
    organiserPic: "https://i.pravatar.cc/100?img=23",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    category: "Food",
    time: "Sat at 12:00 PM",
    location: "Labadi Beach, Accra",
    attendeeCount: 42,
    socialProof: "Fatima and 8 others from your community are going",
  },
  {
    _id: "e3",
    title: "Language Exchange Meetup",
    organiser: "Yuki Tanaka",
    organiserPic: "https://i.pravatar.cc/100?img=36",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    category: "Language",
    time: "Sun at 3:00 PM",
    location: "Cuppa Coffee, Osu",
    attendeeCount: 9,
    socialProof: "Elena and 2 others from your community are going",
  },
  {
    _id: "e4",
    title: "Cultural Dance Night",
    organiser: "Marcus Osei",
    organiserPic: "https://i.pravatar.cc/100?img=8",
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
    category: "Cultural",
    time: "Fri at 8:00 PM",
    location: "Sandbox Beach, Accra",
    attendeeCount: 56,
    socialProof: "Kofi and 12 others from your community are going",
  },
];

// ── Event card ─────────────────────────────────────────────────────────────────
function EventCard({ event }) {
  return (
    <View style={styles.eventCard}>
      {/* Cover image */}
      <Image source={{ uri: event.image }} style={styles.eventImage} />

      {/* Info section */}
      <View style={styles.eventInfo}>
        <View style={styles.eventTopRow}>
          <Image source={{ uri: event.organiserPic }} style={styles.organiserAvatar} />
          <View style={styles.eventMeta}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.organiserName}>{event.organiser}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{event.category}</Text>
          </View>
        </View>

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={14} color={KULA.muted} />
            <Text style={styles.detailText}>{event.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={14} color={KULA.muted} />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={14} color={KULA.muted} />
            <Text style={styles.detailText}>{event.attendeeCount} attending</Text>
          </View>
        </View>

        <Text style={styles.socialProof}>{event.socialProof}</Text>
      </View>
    </View>
  );
}

// ── Events Screen ──────────────────────────────────────────────────────────────
export default function EventsScreen() {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(1); // Tue = index 1
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered =
    selectedCategory === "All"
      ? EVENTS
      : EVENTS.filter((e) => e.category === selectedCategory);

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
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.heading}>Events</Text>
              <TouchableOpacity>
                <Ionicons name="calendar-outline" size={24} color={KULA.brown} />
              </TouchableOpacity>
            </View>

            {/* Day selector */}
            <View style={styles.dayRow}>
              <TouchableOpacity style={styles.chevron}>
                <Ionicons name="chevron-back" size={18} color={KULA.muted} />
              </TouchableOpacity>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
                {DAYS.map((d, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.dayBtn, i === selectedDay && styles.dayBtnActive]}
                    onPress={() => setSelectedDay(i)}
                  >
                    <Text style={[styles.dayLabel, i === selectedDay && styles.dayLabelActive]}>
                      {d.day}
                    </Text>
                    <Text style={[styles.dayDate, i === selectedDay && styles.dayDateActive]}>
                      {d.date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.chevron}>
                <Ionicons name="chevron-forward" size={18} color={KULA.muted} />
              </TouchableOpacity>
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
                  style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[styles.catPillText, selectedCategory === cat && styles.catPillTextActive]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* spacer */}
            <View style={{ height: 8 }} />
          </>
        )}
        renderItem={({ item }) => <EventCard event={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />

      <FAB onPress={() => navigation.navigate("NewPostScreen")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: KULA.cream },
  listContent: { paddingHorizontal: 20, paddingBottom: 120 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 16,
  },
  heading: { fontSize: 26, fontWeight: "800", color: KULA.brown },

  // Day selector
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  chevron: { padding: 6 },
  daysScroll: { flex: 1 },
  dayBtn: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: KULA.white,
    marginRight: 8,
    minWidth: 52,
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  dayBtnActive: {
    backgroundColor: KULA.teal,
    shadowColor: KULA.teal,
    shadowOpacity: 0.3,
    elevation: 4,
  },
  dayLabel: { fontSize: 11, fontWeight: "500", color: KULA.muted },
  dayLabelActive: { color: "rgba(255,255,255,0.8)" },
  dayDate: { fontSize: 17, fontWeight: "700", color: KULA.brown, marginTop: 2 },
  dayDateActive: { color: KULA.white },

  // Categories
  categoriesRow: { gap: 8, paddingBottom: 4 },
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

  // Event card
  eventCard: {
    backgroundColor: KULA.white,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  eventImage: { width: "100%", height: 200, resizeMode: "cover" },
  eventInfo: { padding: 16 },
  eventTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  organiserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: KULA.border,
  },
  eventMeta: { flex: 1 },
  eventTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: KULA.brown,
    lineHeight: 23,
    marginBottom: 2,
  },
  organiserName: { fontSize: 13, color: KULA.muted },
  categoryBadge: {
    backgroundColor: KULA.cream,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: KULA.brown,
  },
  eventDetails: { gap: 6, marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { fontSize: 13, color: KULA.muted },
  socialProof: {
    fontSize: 13,
    color: KULA.teal,
    fontWeight: "500",
    lineHeight: 19,
  },
});
