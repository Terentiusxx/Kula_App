import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { KULA } from "../constants/Styles";
import FAB from "../components/UI/FAB";
import { useNavigation } from "@react-navigation/native";

// ── Mock message threads ───────────────────────────────────────────────────────
const THREADS = [
  {
    _id: "t1",
    contactName: "Kofi Mensah",
    preview: "See you at the food meetup!",
    timestamp: "2m ago",
    unread: 2,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=80",
    isGroup: false,
  },
  {
    _id: "t2",
    contactName: "Tech Newcomers",
    preview: "Sarah: Anyone tried the new co-working space?",
    timestamp: "1h ago",
    unread: 0,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80",
    isGroup: true,
  },
  {
    _id: "t3",
    contactName: "Amara Okafor",
    preview: "Thanks for the restaurant recommendation!",
    timestamp: "3h ago",
    unread: 0,
    image: "https://i.pravatar.cc/200?img=47",
    isGroup: false,
  },
  {
    _id: "t4",
    contactName: "Fatima Al-Rashid",
    preview: "The kibbeh recipe is on its way 📩",
    timestamp: "Yesterday",
    unread: 1,
    image: "https://i.pravatar.cc/200?img=23",
    isGroup: false,
  },
  {
    _id: "t5",
    contactName: "Food Lovers GH",
    preview: "Priya: Anyone joining the cooking class tonight?",
    timestamp: "Yesterday",
    unread: 0,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80",
    isGroup: true,
  },
];

// ── Thread row ─────────────────────────────────────────────────────────────────
function ThreadRow({ thread }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate("ChatScreen")}
      activeOpacity={0.7}
    >
      {/* Avatar + unread badge */}
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: thread.image }} style={styles.avatar} />
        {thread.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{thread.unread}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contactName}>{thread.contactName}</Text>
        <Text style={styles.preview} numberOfLines={1}>
          {thread.preview}
        </Text>
      </View>

      {/* Timestamp */}
      <Text style={styles.timestamp}>{thread.timestamp}</Text>
    </TouchableOpacity>
  );
}

// ── Messages Screen ────────────────────────────────────────────────────────────
export default function MessagesScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  const filtered = THREADS.filter(
    (t) =>
      t.contactName.toLowerCase().includes(search.toLowerCase()) ||
      t.preview.toLowerCase().includes(search.toLowerCase())
  );

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
              <Text style={styles.heading}>Messages</Text>
            </View>

            {/* Search bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color={KULA.muted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search messages..."
                placeholderTextColor={KULA.muted}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <View style={{ height: 8 }} />
          </>
        )}
        renderItem={({ item, index }) => (
          <View>
            <ThreadRow thread={item} />
            {index < filtered.length - 1 && <View style={styles.divider} />}
          </View>
        )}
      />

      <FAB onPress={() => navigation.navigate("FindFriendsScreen")} icon="create-outline" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: KULA.cream },
  listContent: { paddingBottom: 120 },

  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16 },
  heading: { fontSize: 26, fontWeight: "800", color: KULA.brown },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: KULA.white,
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginHorizontal: 20,
    gap: 10,
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, color: KULA.brown },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: KULA.white,
    gap: 14,
  },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    resizeMode: "cover",
    backgroundColor: KULA.border,
  },
  unreadBadge: {
    position: "absolute",
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: KULA.terracotta,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: KULA.white,
  },
  unreadText: { fontSize: 10, fontWeight: "700", color: KULA.white },

  content: { flex: 1 },
  contactName: {
    fontSize: 16,
    fontWeight: "700",
    color: KULA.brown,
    marginBottom: 3,
  },
  preview: { fontSize: 13, color: KULA.muted, lineHeight: 18 },

  timestamp: { fontSize: 12, color: KULA.muted, alignSelf: "flex-start", marginTop: 2 },

  divider: {
    height: 1,
    backgroundColor: KULA.border,
    marginLeft: 86, // align with text, after avatar
  },
});
