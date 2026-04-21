import {
  createCollectionDocument,
  getCollectionDocuments,
} from "../firebase/firestoreService";
import {
  getUiState,
  listCacheRecords,
  upsertCacheRecord,
  upsertUiState,
} from "../localdb/cacheRepository";
import { queueOrProcessWrite } from "../sync/outboxSyncService";

function fail(error) {
  return {
    ok: false,
    data: null,
    error: {
      code: error?.code || "events_error",
      message: error?.message || "Unexpected events error",
    },
  };
}

function ok(data) {
  return { ok: true, data, error: null };
}

function membershipStateKey(userId) {
  return "joined_events:" + String(userId || "");
}

function readEventIdsFromState(userId) {
  const state = getUiState(membershipStateKey(userId));
  if (!state.ok) {
    return [];
  }
  const ids = state.data?.payload?.eventIds;
  return Array.isArray(ids) ? ids : [];
}

function persistEventIds(userId, nextIds = []) {
  return upsertUiState(membershipStateKey(userId), {
    userId,
    eventIds: nextIds,
    updatedAt: Date.now(),
  });
}

export async function fetchEvents(limitCount = 50) {
  const remoteResult = await getCollectionDocuments("events", {
    orderByField: "startTime",
    orderDirection: "asc",
    maxResults: limitCount,
  });

  if (!remoteResult.ok) {
    return remoteResult;
  }

  remoteResult.data.forEach((item) => {
    if (item.id) {
      upsertCacheRecord("events_cache", item.id, item);
    }
  });

  return remoteResult;
}

export function loadCachedEvents(limitCount = 50) {
  return listCacheRecords("events_cache", limitCount);
}

export async function joinEvent({ userId, eventId }) {
  if (!userId || !eventId) {
    return fail({ code: "missing_join_fields", message: "userId and eventId are required" });
  }

  const joinedAt = Date.now();
  const currentIds = readEventIdsFromState(userId);
  const nextIds = currentIds.includes(eventId) ? currentIds : [...currentIds, eventId];
  const cacheResult = persistEventIds(userId, nextIds);
  if (!cacheResult.ok) {
    return cacheResult;
  }

  return queueOrProcessWrite(
    {
      entityType: "event_attendees",
      operation: "join",
      payload: { userId, eventId, joinedAt },
    },
    {
      "event_attendees:join": async (item) => {
        const payload = item?.payload || {};
        const result = await createCollectionDocument("event_attendees", {
          userId: payload.userId,
          eventId: payload.eventId,
          joinedAt: payload.joinedAt || Date.now(),
        });
        if (!result.ok) {
          throw new Error(result.error?.message || "Failed to persist event join");
        }
        return true;
      },
    }
  );
}

export async function fetchUserEventMemberships(userId, limitCount = 100) {
  if (!userId) {
    return fail({ code: "missing_user_id", message: "userId is required" });
  }

  const remoteResult = await getCollectionDocuments("event_attendees", {
    filters: [{ field: "userId", operator: "==", value: userId }],
    orderByField: "joinedAt",
    orderDirection: "desc",
    maxResults: limitCount,
  });

  if (!remoteResult.ok) {
    const cachedIds = readEventIdsFromState(userId);
    const fallback = cachedIds.map((eventId) => ({ userId, eventId, joinedAt: null }));
    return ok(fallback);
  }

  const remoteIds = remoteResult.data
    .map((item) => item.eventId)
    .filter((id) => Boolean(id));
  persistEventIds(userId, remoteIds);
  return remoteResult;
}
