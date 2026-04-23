import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KULA } from "../constants/Styles";
import { fetchEvents, loadCachedEvents } from "../services/repositories/eventsRepository";

function normalizeDate(value) {
  if (!value) {
    return null;
  }
  if (typeof value?.toDate === "function") {
    return value.toDate();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function dayKey(value) {
  const date = normalizeDate(value);
  if (!date) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

function prettyDate(value) {
  const date = normalizeDate(value);
  if (!date) {
    return "Date TBA";
  }
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function EventsCalendarScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDateKey, setSelectedDateKey] = useState(dayKey(new Date()));

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Calendar",
    });
  }, [navigation]);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      setIsLoading(true);
      setErrorMessage("");
      const result = await fetchEvents(200);
      if (!active) {
        return;
      }

      if (result.ok && Array.isArray(result.data) && result.data.length > 0) {
        setEvents(result.data);
        setIsLoading(false);
        return;
      }

      const cached = loadCachedEvents(200);
      if (cached.ok) {
        const mapped = (cached.data || []).map((item) => ({
          _id: item.id,
          id: item.id,
          ...item.payload,
        }));
        setEvents(mapped);
      } else {
        setEvents([]);
      }
      if (!result.ok) {
        setErrorMessage(result.error?.message || "Could not load events.");
      }
      setIsLoading(false);
    }

    loadEvents();
    return () => {
      active = false;
    };
  }, []);

  const dateOptions = useMemo(() => {
    const keys = new Set();
    events.forEach((event) => {
      const key = dayKey(event.startTime || event.date);
      if (key) {
        keys.add(key);
      }
    });
    return [...keys].sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!selectedDateKey) {
      return events;
    }
    return events.filter((event) => {
      const eventKey = dayKey(event.startTime || event.date);
      return eventKey === selectedDateKey;
    });
  }, [events, selectedDateKey]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={KULA.cream} />

      <View style={styles.dateRow}>
        <TouchableOpacity
          style={[
            styles.datePill,
            !selectedDateKey && styles.datePillActive,
          ]}
          onPress={() => setSelectedDateKey("")}
        >
          <Text
            style={[
              styles.datePillText,
              !selectedDateKey && styles.datePillTextActive,
            ]}
          >
            All dates
          </Text>
        </TouchableOpacity>
        {dateOptions.map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.datePill, selectedDateKey === key && styles.datePillActive]}
            onPress={() => setSelectedDateKey(key)}
          >
            <Text
              style={[
                styles.datePillText,
                selectedDateKey === key && styles.datePillTextActive,
              ]}
            >
              {prettyDate(key)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.emptyWrap}>
          <ActivityIndicator color={KULA.teal} />
          <Text style={styles.emptyText}>Loading calendar events...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item, index) => String(item._id || item.id || index)}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.eventCard}>
              <Text style={styles.eventTitle}>{item.title || "Community Event"}</Text>
              <Text style={styles.eventMeta}>
                {prettyDate(item.startTime || item.date)} · {item.time || "Time TBA"}
              </Text>
              <Text style={styles.eventMeta}>{item.location || "Location TBA"}</Text>
              <Text style={styles.eventMeta}>
                {Number(item.attendeeCount || 0)} attending
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                {errorMessage || "No events found for this date."}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KULA.cream,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  dateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  datePill: {
    backgroundColor: KULA.white,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: KULA.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  datePillActive: {
    backgroundColor: KULA.teal,
    borderColor: KULA.teal,
  },
  datePillText: {
    color: KULA.brown,
    fontSize: 13,
    fontWeight: "600",
  },
  datePillTextActive: {
    color: KULA.white,
  },
  eventCard: {
    backgroundColor: KULA.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: KULA.border,
    padding: 14,
    marginBottom: 10,
  },
  eventTitle: {
    color: KULA.brown,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  eventMeta: {
    color: KULA.muted,
    fontSize: 13,
    marginBottom: 2,
  },
  emptyWrap: {
    paddingVertical: 30,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 8,
    color: KULA.muted,
    textAlign: "center",
    fontSize: 14,
  },
});
