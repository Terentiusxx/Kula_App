import React, { useContext } from "react";
import { SignedOutStack, SignedInStack } from "./navigation";
import { AuthContext } from "./store/auth-context";

const AuthNavigation = () => {
  const authCtx = useContext(AuthContext);
  const signedOutInitialRoute = authCtx.hasCompletedOnboarding
    ? "LoginScreen"
    : "OnboardingScreen";

  return (
    <>
      {authCtx.isAuthenticated ? (
        <SignedInStack />
      ) : (
        <SignedOutStack initialRouteName={signedOutInitialRoute} />
      )}
    </>
  );
};

export default AuthNavigation;
