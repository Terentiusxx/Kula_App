import {
  searchUsersByText,
  upsertUserProfile,
} from "../firebase/firestoreService";
import { isOnline } from "../network/connectivityService";
import {
  listCacheRecords,
  upsertCacheRecord,
  upsertUiState,
} from "../localdb/cacheRepository";

function fail(error) {
  return {
    ok: false,
    data: null,
    error: {
      code: error?.code || "discovery_error",
      message: error?.message || "Unexpected discovery error",
    },
  };
}

function normalizeResult(data, source = "remote") {
  return { ok: true, data, error: null, source };
}

function extractCachedUsers(cacheResult) {
  if (!cacheResult?.ok || !Array.isArray(cacheResult.data)) {
    return [];
  }

  return cacheResult.data
    .map((item) => item?.payload)
    .filter((payload) => payload && (payload.id || payload._id));
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCoordinates(location = {}) {
  const latitude = toNumber(location.latitude ?? location.lat);
  const longitude = toNumber(location.longitude ?? location.lng ?? location.lon);
  if (latitude === null || longitude === null) {
    return null;
  }
  return { latitude, longitude };
}

function getDistanceScore(baseLocation = {}, userLocation = {}) {
  const distanceKm = getDistanceKmApprox(baseLocation, userLocation);
  if (!Number.isFinite(distanceKm)) {
    return 0;
  }
  const maxDistanceKm = 100;
  return Math.max(0, 1 - distanceKm / maxDistanceKm);
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function getDistanceKmApprox(baseLocation = {}, userLocation = {}) {
  const baseCoords = normalizeCoordinates(baseLocation);
  const userCoords = normalizeCoordinates(userLocation);

  if (!baseCoords || !userCoords) {
    return null;
  }

  const earthRadiusKm = 6371;
  const lat1 = toRadians(baseCoords.latitude);
  const lat2 = toRadians(userCoords.latitude);
  const deltaLat = toRadians(userCoords.latitude - baseCoords.latitude);
  const deltaLon = toRadians(userCoords.longitude - baseCoords.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function getInterestScore(currentInterests = [], candidateInterests = []) {
  if (!Array.isArray(currentInterests) || currentInterests.length === 0) {
    return 0;
  }

  const currentSet = new Set(currentInterests.map((item) => String(item).toLowerCase()));
  let shared = 0;

  candidateInterests.forEach((item) => {
    if (currentSet.has(String(item).toLowerCase())) {
      shared += 1;
    }
  });

  return shared;
}

function rankUsers(users = [], context = {}) {
  const currentUser = context.currentUser || {};
  const currentUserId = currentUser.id || currentUser._id;
  const baseLocation = currentUser.location || {};
  const currentInterests = currentUser.interests || [];
  const maxDistanceKm =
    Number.isFinite(Number(context.maxDistanceKm)) && Number(context.maxDistanceKm) > 0
      ? Number(context.maxDistanceKm)
      : null;

  return [...users]
    .filter((item) => {
      const userId = item.id || item._id;
      return userId && userId !== currentUserId;
    })
    .map((item) => {
      const interestScore = getInterestScore(currentInterests, item.interests || []);
      const distanceScore = getDistanceScore(baseLocation, item.location || {});
      const distanceKmApprox = getDistanceKmApprox(baseLocation, item.location || {});
      const rankingScore = interestScore * 10 + distanceScore;
      const sharedInterests = (item.interests || []).filter((candidateInterest) =>
        (currentInterests || [])
          .map((currentInterest) => String(currentInterest || "").toLowerCase())
          .includes(String(candidateInterest || "").toLowerCase())
      );
      return {
        ...item,
        rankingScore,
        distanceScore,
        distanceKmApprox,
        sharedInterestsCount: sharedInterests.length,
        sharedInterests,
      };
    })
    .filter((item) => {
      if (!maxDistanceKm) {
        return true;
      }
      const distance = Number(item.distanceKmApprox);
      return Number.isFinite(distance) && distance <= maxDistanceKm;
    })
    .sort((a, b) => b.rankingScore - a.rankingScore);
}

function writeUsersToCache(users = []) {
  users.forEach((item) => {
    const recordId = item.id || item._id;
    if (recordId) {
      upsertCacheRecord("users_cache", String(recordId), item);
    }
  });
}

export async function fetchNearbyUsers({
  searchText = "",
  maxResults = 50,
  currentUser = null,
  maxDistanceKm = 100,
} = {}) {
  const online = await isOnline();
  if (!online) {
    const cachedResult = loadCachedNearbyUsers(maxResults, { currentUser, maxDistanceKm });
    return normalizeResult(cachedResult.ok ? cachedResult.data : [], "cache");
  }

  const remoteResult = await searchUsersByText(searchText, maxResults);

  if (!remoteResult.ok) {
    const cachedResult = loadCachedNearbyUsers(maxResults, { currentUser, maxDistanceKm });
    if (cachedResult.ok) {
      return normalizeResult(cachedResult.data, "cache");
    }
    return remoteResult;
  }

  const ranked = rankUsers(remoteResult.data, { currentUser, maxDistanceKm });
  writeUsersToCache(ranked);

  return normalizeResult(ranked, "remote");
}

export function loadCachedNearbyUsers(limitCount = 50, options = {}) {
  const cachedResult = listCacheRecords("users_cache", limitCount);
  if (!cachedResult.ok) {
    return cachedResult;
  }

  const users = extractCachedUsers(cachedResult);
  const ranked = rankUsers(users, {
    currentUser: options.currentUser || null,
    maxDistanceKm: options.maxDistanceKm,
  });
  return normalizeResult(ranked, "cache");
}

export async function saveUserDiscoveryLocation(userId, locationPayload = {}) {
  if (!userId) {
    return fail({ code: "missing_user_id", message: "userId is required" });
  }

  const cacheResult = upsertUiState("discovery_location:" + userId, {
    userId,
    location: locationPayload,
    updatedAt: Date.now(),
  });

  if (!cacheResult.ok) {
    return cacheResult;
  }

  const cloudResult = await upsertUserProfile(userId, {
    location: locationPayload,
  });

  if (!cloudResult.ok) {
    return cloudResult;
  }

  return {
    ok: true,
    data: true,
    error: null,
  };
}
