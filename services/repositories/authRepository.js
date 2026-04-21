import {
  isEmailSignInLink,
  loginWithEmail,
  loginWithEmailLinkCredential,
  loginWithGoogleCredential,
  logoutCurrentUser,
  registerWithEmail,
  restoreAuthSession,
  sendPasswordlessEmailLink,
  subscribeToAuthChanges,
} from "../firebase/authService";

function ok(data) {
  return { ok: true, data, error: null };
}

export async function login(credentials = {}) {
  return loginWithEmail(credentials);
}

export async function register(payload = {}) {
  return registerWithEmail(payload);
}

export async function sendPasswordlessLoginLink(payload = {}) {
  return sendPasswordlessEmailLink(payload);
}

export async function loginWithEmailLink(payload = {}) {
  return loginWithEmailLinkCredential(payload);
}

export async function loginWithGoogle(payload = {}) {
  return loginWithGoogleCredential(payload);
}

export function isEmailLinkSignInUrl(emailLink = "") {
  return isEmailSignInLink(emailLink);
}

export async function logout() {
  return logoutCurrentUser();
}

export async function restoreSession() {
  return restoreAuthSession();
}

export function subscribeToSessionChanges(listener) {
  return subscribeToAuthChanges((user) => {
    listener(ok(user));
  });
}
