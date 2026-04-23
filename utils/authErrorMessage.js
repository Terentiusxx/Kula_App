const AUTH_ERROR_MESSAGES = {
  "auth/invalid-email": "Enter a valid email address.",
  "auth/missing-password": "Password is required.",
  "auth/weak-password": "Password must be at least 8 characters long.",
  "auth/invalid-credential":
    "Sign-in failed due to invalid credentials or provider configuration.",
  "auth/user-not-found": "No account exists for this email.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/email-already-in-use": "That email is already in use. Try signing in instead.",
  "auth/account-exists-with-different-credential":
    "This email is already linked to a different sign-in method.",
  "auth/operation-not-allowed":
    "This sign-in method is not enabled in Firebase Authentication.",
  "auth/unauthorized-domain":
    "This app domain is not authorized in Firebase Authentication settings.",
  "auth/unauthorized-continue-uri":
    "Email link URL is not authorized. Add it to Firebase authorized domains.",
  missing_google_client_id:
    "Google sign-in is not configured for this platform. Check EXPO_PUBLIC_GOOGLE client IDs.",
  missing_email_link_url:
    "Email link URL is missing. Set EXPO_PUBLIC_AUTH_EMAIL_LINK_URL to an HTTPS URL.",
  invalid_email_link_url:
    "Email link URL must be a valid HTTPS URL.",
  pending_email_missing:
    "Open the sign-in link on the same device where you requested it.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

export function getFriendlyAuthErrorMessage(error) {
  const code = String(error?.code || "").trim();
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }
  return error?.message || "Something went wrong. Please try again.";
}
