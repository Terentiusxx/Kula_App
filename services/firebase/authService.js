import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailLink,
  signOut,
  updateProfile,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import {
  createMissingFirebaseConfigError,
  firebaseConfig,
  hasFirebaseConfig,
  getFirebaseApp,
} from "./firebaseApp";

function ok(data) {
  return { ok: true, data, error: null };
}

function fail(error) {
  return {
    ok: false,
    data: null,
    error: {
      code: error?.code || "unknown",
      message: error?.message || "Unexpected authentication error",
    },
  };
}

function getAuthClient() {
  const app = getFirebaseApp();

  if (Platform.OS === "web") {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (_error) {
    // initializeAuth throws when auth was already initialized for this app.
    return getAuth(app);
  }
}

function failMissingConfig() {
  return fail(createMissingFirebaseConfigError());
}

function buildEmailLinkSettings() {
  const continueUrl =
    process.env.EXPO_PUBLIC_AUTH_EMAIL_LINK_URL ||
    (firebaseConfig.authDomain
      ? "https://" + firebaseConfig.authDomain
      : "");

  if (!continueUrl) {
    return null;
  }

  return {
    url: continueUrl,
    handleCodeInApp: true,
  };
}

export async function registerWithEmail({ email, password, displayName }) {
  if (!email || !password) {
    return fail({ code: "missing_credentials", message: "Email and password are required" });
  }

  if (!hasFirebaseConfig()) {
    return failMissingConfig();
  }

  try {
    const auth = getAuthClient();
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }

    return ok(credential.user);
  } catch (error) {
    return fail(error);
  }
}

export async function loginWithEmail({ email, password }) {
  if (!email || !password) {
    return fail({ code: "missing_credentials", message: "Email and password are required" });
  }

  if (!hasFirebaseConfig()) {
    return failMissingConfig();
  }

  try {
    const auth = getAuthClient();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return ok(credential.user);
  } catch (error) {
    return fail(error);
  }
}

export async function sendPasswordlessEmailLink({ email }) {
  if (!email) {
    return fail({ code: "missing_email", message: "Email is required" });
  }

  if (!hasFirebaseConfig()) {
    return failMissingConfig();
  }

  const actionCodeSettings = buildEmailLinkSettings();
  if (!actionCodeSettings) {
    return fail({
      code: "missing_email_link_url",
      message:
        "Email link sign-in URL is missing. Set EXPO_PUBLIC_AUTH_EMAIL_LINK_URL or provide EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN.",
    });
  }

  try {
    const auth = getAuthClient();
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    return ok(true);
  } catch (error) {
    return fail(error);
  }
}

export function isEmailSignInLink(emailLink) {
  if (!emailLink || !hasFirebaseConfig()) {
    return false;
  }

  try {
    return isSignInWithEmailLink(getAuthClient(), emailLink);
  } catch (_error) {
    return false;
  }
}

export async function loginWithEmailLinkCredential({ email, emailLink }) {
  if (!email || !emailLink) {
    return fail({
      code: "missing_email_link_fields",
      message: "Email and emailLink are required",
    });
  }

  if (!hasFirebaseConfig()) {
    return failMissingConfig();
  }

  if (!isEmailSignInLink(emailLink)) {
    return fail({ code: "invalid_email_link", message: "The provided email link is invalid" });
  }

  try {
    const auth = getAuthClient();
    const credential = await signInWithEmailLink(auth, email, emailLink);
    return ok(credential.user);
  } catch (error) {
    return fail(error);
  }
}

export async function loginWithGoogleCredential({ idToken, accessToken }) {
  if (!idToken && !accessToken) {
    return fail({
      code: "missing_google_tokens",
      message: "Google idToken or accessToken is required",
    });
  }

  if (!hasFirebaseConfig()) {
    return failMissingConfig();
  }

  try {
    const auth = getAuthClient();
    const credential = GoogleAuthProvider.credential(idToken || null, accessToken || null);
    const signInResult = await signInWithCredential(auth, credential);
    return ok(signInResult.user);
  } catch (error) {
    return fail(error);
  }
}

export async function logoutCurrentUser() {
  if (!hasFirebaseConfig()) {
    return failMissingConfig();
  }

  try {
    const auth = getAuthClient();
    await signOut(auth);
    return ok(true);
  } catch (error) {
    return fail(error);
  }
}

export function getCurrentAuthUser() {
  if (!hasFirebaseConfig()) {
    return null;
  }

  try {
    return getAuthClient().currentUser;
  } catch (_error) {
    return null;
  }
}

export async function restoreAuthSession() {
  if (!hasFirebaseConfig()) {
    return failMissingConfig();
  }

  try {
    return ok(getAuthClient().currentUser);
  } catch (error) {
    return fail(error);
  }
}

export function subscribeToAuthChanges(onChange) {
  if (!hasFirebaseConfig()) {
    onChange(null);
    return () => {};
  }

  try {
    return onAuthStateChanged(getAuthClient(), onChange);
  } catch (_error) {
    onChange(null);
    return () => {};
  }
}
