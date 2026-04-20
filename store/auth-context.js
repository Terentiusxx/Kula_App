import { createContext, useState } from "react";
import { MOCK_LOGGED_IN_USER } from "../data/mockData";

// ─── Auth Context ─────────────────────────────────────────────────────────────
// Mock mode: no real backend calls. authenticate() immediately signs in with
// MOCK_LOGGED_IN_USER. Swap this for real API calls when the backend is ready.

export const AuthContext = createContext({
  updateUserData: () => {},
  userData: {},
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {},
});

function AuthContentProvider({ children }) {
  const [userData, setUserData] = useState(MOCK_LOGGED_IN_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ── TODO (backend): validate credentials, store JWT, fetch real user ──────
  function authenticate(email, password) {
    // Mock: any credentials work — just sign in immediately
    console.log("[MOCK] authenticate called:", email);
    setIsAuthenticated(true);
  }

  // ── TODO (backend): clear JWT, call logout endpoint ───────────────────────
  function logout() {
    setIsAuthenticated(false);
    setUserData(MOCK_LOGGED_IN_USER); // reset to default mock user
    console.log("[MOCK] logout");
  }

  // ── TODO (backend): PATCH /users/:id with updated fields ──────────────────
  function updateUserData(newData) {
    setUserData((prev) => ({ ...prev, ...newData }));
  }

  return (
    <AuthContext.Provider
      value={{ userData, isAuthenticated, authenticate, logout, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContentProvider;
