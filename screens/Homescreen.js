import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { KULA } from "../constants/Styles";
import { AuthContext } from "../store/auth-context";
import { MOCK_USERS, MOCK_EVENTS } from "../data/mockData";
import { timeDifference } from "../utils/helperFunctions";

const { width } = Dimensions.get("window");
const EVENT_CARD_W = width * 0.48;

// ── Greeting helper ────────────────────────────────────────────────────────────
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ── Nearby Event card ──────────────────────────────────────────────────────────
function EventCard({ event }) {
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventImageContainer}>
        <Image
          source={{
            uri:
              event.coverImage ||
              "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
          }}
          style={styles.eventImage}
        />
        <View style={styles.eventDateBadge}>
          <Text style={styles.eventDateText}>{event.date}</Text>
        </View>
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={styles.eventAttendees}>
          <Ionicons name="people-outline" size={13} color={KULA.muted} />
          <Text style={styles.eventAttendeesText}>
            {event.attendeeCount} attending
          </Text>
        </View>
      </View>
    </View>
  );
}

// ── Suggested Friend row ───────────────────────────────────────────────────────
function FriendRow({ user }) {
  return (
    <View style={styles.friendRow}>
      {/* Avatar — real photo or initials fallback */}
      <View style={[styles.friendAvatar, { backgroundColor: user.avatarColor }]}>
        {user.picturePath ? (
          <Image source={{ uri: user.picturePath }} style={styles.friendAvatarImg} />
        ) : (
          <Text style={styles.friendInitials}>{user.initials}</Text>
        )}
        {/* Online dot */}
        <View style={styles.onlineDot} />
      </View>

      {/* Name + flag */}
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>
          {user.fullName}{" "}
          <Text style={{ fontSize: 16 }}>{user.originFlag}</Text>
        </Text>
        <Text style={styles.friendContext}>{user.contextLine}</Text>
      </View>

      {/* Wave button */}
      <TouchableOpacity style={styles.waveBtn} activeOpacity={0.75}>
        <Text style={styles.waveBtnText}>Wave</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Home Screen ────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const user = authCtx.userData;

  const suggestedFriends = MOCK_USERS.slice(0, 4);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={KULA.cream} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.logoText}>KULA</Text>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate("NotificationsScreen")}
          >
            <Ionicons name="notifications-outline" size={24} color={KULA.brown} />
            {/* Badge */}
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Greeting ── */}
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>
            {getGreeting()},{" "}
            <Text style={styles.greetingName}>
              {user?.fullName?.split(" ")[0] ?? "Ama"}
            </Text>
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={KULA.muted} />
            <Text style={styles.locationText}>
              {" "}
              {user?.currentCity ?? "New in Accra"}
            </Text>
          </View>
        </View>

        {/* ── Nearby Events ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Events</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsScroll}
        >
          {MOCK_EVENTS.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </ScrollView>

        {/* ── Suggested Friends ── */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Suggested Friends</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.friendsList}>
          {suggestedFriends.map((u) => (
            <FriendRow key={u._id} user={u} />
          ))}
        </View>
      </ScrollView>

      {/* ── Floating Action Button ── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("NewPostScreen")}
      >
        <Ionicons name="menu" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KULA.cream,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "800",
    color: KULA.terracotta,
    letterSpacing: 1.5,
  },
  bellBtn: {
    position: "relative",
    padding: 4,
  },
  bellBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: KULA.terracotta,
    justifyContent: "center",
    alignItems: "center",
  },
  bellBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },

  // Greeting
  greetingBlock: {
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: KULA.brown,
    marginBottom: 4,
  },
  greetingName: {
    fontWeight: "800",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: KULA.muted,
  },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: KULA.brown,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: KULA.teal,
  },

  // Events
  eventsScroll: {
    gap: 14,
    paddingRight: 4,
    paddingBottom: 4,
  },
  eventCard: {
    width: EVENT_CARD_W,
    backgroundColor: KULA.white,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 3,
  },
  eventImageContainer: {
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    backgroundColor: KULA.border,
  },
  eventDateBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  eventDateText: {
    fontSize: 11,
    fontWeight: "600",
    color: KULA.brown,
  },
  eventInfo: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: KULA.brown,
    marginBottom: 6,
    lineHeight: 20,
  },
  eventAttendees: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eventAttendeesText: {
    fontSize: 12,
    color: KULA.muted,
  },

  // Friends
  friendsList: {
    gap: 10,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: KULA.white,
    borderRadius: 16,
    padding: 14,
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  friendAvatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: "cover",
  },
  friendInitials: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: KULA.teal,
    borderWidth: 2,
    borderColor: KULA.white,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 15,
    fontWeight: "700",
    color: KULA.brown,
    marginBottom: 2,
  },
  friendContext: {
    fontSize: 12,
    color: KULA.muted,
  },
  waveBtn: {
    borderWidth: 1.5,
    borderColor: KULA.teal,
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  waveBtnText: {
    color: KULA.teal,
    fontWeight: "600",
    fontSize: 14,
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: KULA.teal,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: KULA.teal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
