import NetInfo from "@react-native-community/netinfo";

function normalizeState(state) {
  const isConnected = Boolean(state?.isConnected);
  const isInternetReachable = state?.isInternetReachable;
  const isOnline = isConnected && isInternetReachable !== false;

  return {
    isConnected,
    isInternetReachable,
    isOnline,
    type: state?.type || "unknown",
  };
}

export async function getConnectivitySnapshot() {
  const state = await NetInfo.fetch();
  return normalizeState(state);
}

export function subscribeToConnectivityChanges(listener) {
  return NetInfo.addEventListener((state) => {
    listener(normalizeState(state));
  });
}

export async function isOnline() {
  const state = await getConnectivitySnapshot();
  return state.isOnline;
}
