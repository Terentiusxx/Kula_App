import { getApp, getApps, initializeApp } from "firebase/app";

const REQUIRED_FIREBASE_PUBLIC_KEYS = [
  "EXPO_PUBLIC_FIREBASE_API_KEY",
  "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "EXPO_PUBLIC_FIREBASE_APP_ID",
];

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
};

const CONFIG_KEY_MAP = {
  EXPO_PUBLIC_FIREBASE_API_KEY: "apiKey",
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: "authDomain",
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: "projectId",
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: "storageBucket",
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "messagingSenderId",
  EXPO_PUBLIC_FIREBASE_APP_ID: "appId",
};

function getMissingFirebaseConfigKeys() {
  return REQUIRED_FIREBASE_PUBLIC_KEYS.filter((envKey) => {
    const configKey = CONFIG_KEY_MAP[envKey];
    return !firebaseConfig[configKey];
  });
}

export function hasFirebaseConfig() {
  return getMissingFirebaseConfigKeys().length === 0;
}

export function createMissingFirebaseConfigError() {
  const missingKeys = getMissingFirebaseConfigKeys();
  return {
    code: "firebase_config_missing",
    message:
      "Firebase config values are missing. Set EXPO_PUBLIC_FIREBASE_* environment values before using Firebase services.",
    missingKeys,
  };
}

export function getFirebaseApp() {
  if (!hasFirebaseConfig()) {
    const error = createMissingFirebaseConfigError();
    throw new Error(error.message);
  }

  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }

  return getApp();
}

export { firebaseConfig, getMissingFirebaseConfigKeys, REQUIRED_FIREBASE_PUBLIC_KEYS };
