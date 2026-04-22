import { Dimensions } from "react-native";

// ─── KULA Design Tokens ───────────────────────────────────────────────────────
export const KULA = {
  cream:      "#FAF3E0",  // page background
  white:      "#FFFFFF",  // card surface
  brown:      "#3B2A1A",  // primary text / headings
  teal:       "#1D9E75",  // accent, CTAs, active states
  terracotta: "#C1603A",  // secondary accent
  gold:       "#D4A853",  // highlight / badge
  muted:      "#7A7A9D",  // secondary text
  border:     "#EDE8DC",  // subtle borders on cards
  error:      "#E05252",  // validation errors
};

export const GlobalStyles = {
  colors: {
    // Legacy tokens kept for backward compat
    primary:    KULA.cream,
    primary100: KULA.brown,
    primary200: "#EDE8DC",
    primary300: KULA.white,
    primary500: KULA.border,
    primary600: "#F5EFE0",
    gray:       KULA.muted,
    gray100:    "rgba(59,42,26,0.05)",
    blue:       KULA.teal,
    blue100:    KULA.teal,
    cyan:       "#48C9A9",
    purple:     KULA.teal,
    purpleDark: "#1A8A64",
    magenta:    KULA.terracotta,
    orange:     KULA.gold,
    greenLight: KULA.teal,
    green:      "#4CAF7D",
    red:        KULA.error,
    pink:       KULA.terracotta,
    persianRed: KULA.terracotta,
    darkGreen:  "#1A7A5A",
    tabBarColor: KULA.white,
    yellow:     KULA.gold,
    // KULA direct references
    ...KULA,
  },
  styles: {
    tabBarPadding: 100,
    get windowWidth() {
      return Dimensions.get("window").width;
    },
    get windowHeight() {
      return Dimensions.get("window").height;
    },
  },
};

export const DEFAULT_DP =
  "https://i.pinimg.com/736x/89/bd/4d/89bd4db33ba9999dc990dfc8e0ead989.jpg";
