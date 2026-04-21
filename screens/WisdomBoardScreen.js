import React, { useEffect, useState } from "react";
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
import { fetchWisdomPosts } from "../services/repositories/wisdomRepository";

// ── Mock data ──────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Housing", "Transport", "Culture", "Jobs", "Health"];

// ── Question card ──────────────────────────────────────────────────────────────
function WisdomCard({ post }) {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.card}>
      {/* Author row */}
      <View style={styles.authorRow}>
        <Image source={{ uri: post.authorPic }} style={styles.authorAvatar} />
        <View style={styles.authorInfo}>
          <Text style={styles.questionTitle}>{post.question}</Text>
          <Text style={styles.authorMeta}>
            {post.authorName}
            {"  ·  "}
            {post.timeAgo}
          </Text>
        </View>
        {/* Answer indicator */}
        <View style={styles.answerPill} />
      </View>

      {/* Category tag */}
      <View style={styles.categoryTag}>
        <Text style={styles.categoryTagText}>{post.category}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setLiked((v) => !v)}
        >
          <Ionicons
            name={liked ? "thumbs-up" : "thumbs-up-outline"}
            size={16}
            color={liked ? KULA.teal : KULA.muted}
          />
          <Text style={[styles.actionCount, liked && { color: KULA.teal }]}>
            {liked ? post.likes + 1 : post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={16} color={KULA.muted} />
          <Text style={styles.actionCount}>{post.answerCount} answers</Text>
        </TouchableOpacity>
      </View>

      {/* Top answer block */}
      {post.topAnswer && (
        <View style={styles.topAnswerBox}>
          <View style={styles.topAnswerHeader}>
            <Text style={styles.topAnswerName}>{post.topAnswer.authorName}</Text>
            <Text style={styles.topAnswerBadge}>{post.topAnswer.badge}</Text>
          </View>
          <Text style={styles.topAnswerText}>{post.topAnswer.text}</Text>
        </View>
      )}
    </View>
  );
}

// ── Wisdom Board Screen ────────────────────────────────────────────────────────
export default function WisdomBoardScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wisdomPosts, setWisdomPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadWisdomPosts() {
      setIsLoading(true);
      setLoadError("");
      const result = await fetchWisdomPosts({ maxResults: 60 });

      if (!active) {
        return;
      }

      if (result.ok) {
        setWisdomPosts(result.data || []);
      } else {
        setWisdomPosts([]);
        setLoadError("Could not load wisdom posts right now.");
      }
      setIsLoading(false);
    }

    loadWisdomPosts();

    return () => {
      active = false;
    };
  }, []);

  const filtered =
    selectedCategory === "All"
      ? wisdomPosts
      : wisdomPosts.filter((p) => p.category === selectedCategory);

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
            {/* Header section — white block */}
            <View style={styles.headerBlock}>
              <Text style={styles.heading}>Wisdom Board</Text>
              <Text style={styles.subtitle}>
                Get practical advice from the community
              </Text>

              {/* Category pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesRow}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.catPill,
                      selectedCategory === cat && styles.catPillActive,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.catPillText,
                        selectedCategory === cat && styles.catPillTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={{ height: 16 }} />
          </>
        )}
        renderItem={({ item }) => <WisdomCard post={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>
              {isLoading
                ? "Loading wisdom posts..."
                : loadError || "No wisdom posts available yet."}
            </Text>
          </View>
        }
      />

      <FAB onPress={() => {}} icon="add-outline" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: KULA.cream },
  listContent: { paddingBottom: 120 },

  // Header
  headerBlock: {
    backgroundColor: KULA.white,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: KULA.border,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: KULA.brown,
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: KULA.muted, marginBottom: 16 },

  categoriesRow: { gap: 8, paddingBottom: 2 },
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

  // Question card
  card: {
    backgroundColor: KULA.white,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    shadowColor: KULA.brown,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 12,
  },
  authorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    resizeMode: "cover",
    backgroundColor: KULA.border,
    marginTop: 2,
  },
  authorInfo: { flex: 1 },
  questionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: KULA.brown,
    lineHeight: 24,
    marginBottom: 4,
  },
  authorMeta: { fontSize: 13, color: KULA.muted },
  answerPill: {
    width: 48,
    height: 24,
    borderRadius: 50,
    backgroundColor: KULA.teal,
    alignSelf: "flex-start",
    marginTop: 4,
  },

  categoryTag: {
    alignSelf: "flex-start",
    backgroundColor: KULA.cream,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
  },
  categoryTagText: { fontSize: 12, color: KULA.brown, fontWeight: "500" },

  actionsRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 14,
  },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionCount: { fontSize: 14, color: KULA.muted, fontWeight: "500" },

  // Top answer
  topAnswerBox: {
    backgroundColor: "#E8C96D22",
    borderLeftWidth: 3,
    borderLeftColor: KULA.gold,
    borderRadius: 12,
    padding: 14,
  },
  topAnswerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  topAnswerName: { fontSize: 15, fontWeight: "700", color: KULA.brown },
  topAnswerBadge: { fontSize: 12, color: KULA.terracotta, fontWeight: "500" },
  topAnswerText: {
    fontSize: 14,
    color: KULA.brown,
    lineHeight: 21,
  },
  emptyWrap: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: KULA.muted,
    textAlign: "center",
  },
});
