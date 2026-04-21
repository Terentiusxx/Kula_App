import { getCollectionDocuments } from "../firebase/firestoreService";

function ok(data, source = "remote") {
  return { ok: true, data, error: null, source };
}

function fail(error) {
  return {
    ok: false,
    data: null,
    error: {
      code: error?.code || "food_culture_repository_error",
      message: error?.message || "Unexpected food/culture repository error",
    },
  };
}

function normalizeCuisine(item = {}, index = 0) {
  const id = item.id || item._id || "cuisine_" + index;
  return {
    _id: String(id),
    name: item.name || item.title || "Cuisine",
    image:
      item.image ||
      item.coverImage ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80",
  };
}

function normalizeRestaurant(item = {}, index = 0) {
  const id = item.id || item._id || "restaurant_" + index;
  return {
    _id: String(id),
    name: item.name || "Restaurant",
    cuisine: item.cuisine || item.category || "Global",
    rating: Number(item.rating || 0),
    reviewCount: Number(item.reviewCount || item.reviews || 0),
    distance: item.distance || "Nearby",
    isOpen: Boolean(item.isOpen),
    image:
      item.image ||
      item.coverImage ||
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  };
}

export async function fetchCuisines(maxResults = 30) {
  try {
    const remote = await getCollectionDocuments("cuisines", {
      orderByField: "updatedAt",
      orderDirection: "desc",
      maxResults,
    });

    if (!remote.ok) {
      return fail(remote.error);
    }

    return ok((remote.data || []).map(normalizeCuisine), "remote");
  } catch (error) {
    return fail(error);
  }
}

export async function fetchRestaurants(maxResults = 30) {
  try {
    const remote = await getCollectionDocuments("restaurants", {
      orderByField: "updatedAt",
      orderDirection: "desc",
      maxResults,
    });

    if (!remote.ok) {
      return fail(remote.error);
    }

    return ok((remote.data || []).map(normalizeRestaurant), "remote");
  } catch (error) {
    return fail(error);
  }
}

