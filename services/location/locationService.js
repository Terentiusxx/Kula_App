import * as Location from "expo-location";

function ok(data) {
  return { ok: true, data, error: null };
}

function fail(error) {
  return {
    ok: false,
    data: null,
    error: {
      code: error?.code || "location_error",
      message: error?.message || "Unexpected location error",
    },
  };
}

export async function requestForegroundLocationPermission() {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    return ok(permission);
  } catch (error) {
    return fail(error);
  }
}

export async function getCurrentLocation(options = {}) {
  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      ...options,
    });

    return ok(position);
  } catch (error) {
    return fail(error);
  }
}

export async function watchLocation(onChange, options = {}) {
  try {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 50,
        timeInterval: 15000,
        ...options,
      },
      onChange
    );

    return ok(subscription);
  } catch (error) {
    return fail(error);
  }
}

export function stopLocationWatch(subscription) {
  if (subscription?.remove) {
    subscription.remove();
  }
}

export function roundLocationCoordinates(coords = {}, decimals = 3) {
  const factor = Math.pow(10, decimals);

  return {
    latitude: Math.round(Number(coords.latitude || 0) * factor) / factor,
    longitude: Math.round(Number(coords.longitude || 0) * factor) / factor,
  };
}

export function getLocationPermissionState(permission = {}) {
  if (permission.granted) {
    return "granted";
  }

  if (permission.canAskAgain === false) {
    return "permanently_denied";
  }

  return "denied";
}
