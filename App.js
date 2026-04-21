import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext } from "react";
import { Alert, AppState, Linking, LogBox, StyleSheet, View } from "react-native";
import AuthNavigation from "./AuthNavigation";
import AuthContentProvider, { AuthContext } from "./store/auth-context";
import { GlobalStyles } from "./constants/Styles";
import Loader from "./components/UI/Loader";
import { initializeSchema, runLocalDbSmokeTest } from "./services/localdb/schema";
import { createCollectionDocument } from "./services/firebase/firestoreService";
import { startOutboxAutoSync, syncOutbox } from "./services/sync/outboxSyncService";
import { subscribeToSessionChanges } from "./services/repositories/authRepository";

export default function App() {
  LogBox.ignoreAllLogs();
  function Root() {
    const [isTryingLogin, setIsTryingLogin] = useState(true);
    const authCtx = useContext(AuthContext);

    const outboxProcessors = {
      "community_memberships:join": async (item) => {
        const payload = item?.payload || {};
        const result = await createCollectionDocument("community_memberships", {
          userId: payload.userId,
          communityId: payload.communityId,
          joinedAt: payload.joinedAt || Date.now(),
        });
        if (!result.ok) {
          throw new Error(result.error?.message || "Community join sync failed");
        }
        return true;
      },
      "event_attendees:join": async (item) => {
        const payload = item?.payload || {};
        const result = await createCollectionDocument("event_attendees", {
          userId: payload.userId,
          eventId: payload.eventId,
          joinedAt: payload.joinedAt || Date.now(),
        });
        if (!result.ok) {
          throw new Error(result.error?.message || "Event join sync failed");
        }
        return true;
      },
      "chat_messages:send": async (item) => {
        const payload = item?.payload || {};
        const result = await createCollectionDocument("chats/" + payload.chatId + "/messages", {
          senderId: payload.senderId,
          type: "text",
          text: payload.text,
          status: "sent",
        });
        if (!result.ok) {
          throw new Error(result.error?.message || "Message sync failed");
        }
        return true;
      },
    };

    useEffect(() => {
      let isMounted = true;

      async function bootstrapApp() {
        const schemaResult = initializeSchema();
        if (!schemaResult.ok) {
          console.warn("SQLite schema initialization failed", schemaResult.error);
        } else {
          const smokeResult = runLocalDbSmokeTest();
          if (!smokeResult.ok) {
            console.warn("SQLite smoke test failed", smokeResult.error);
          }
        }

        await authCtx.restoreSession();

        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          const emailLinkResult = await authCtx.handleEmailLinkSignIn(initialUrl);
          if (!emailLinkResult.ok) {
            console.warn("Email link sign-in failed", emailLinkResult.error);
            Alert.alert(
              "Sign-in link failed",
              emailLinkResult.error?.message || "This sign-in link is invalid or expired. Request a new one from login."
            );
          }
        }

        if (isMounted) {
          setIsTryingLogin(false);
        }
      }

      bootstrapApp();

      return () => {
        isMounted = false;
      };
    }, []);

    useEffect(() => {
      const subscription = Linking.addEventListener("url", ({ url }) => {
        authCtx.handleEmailLinkSignIn(url).then((result) => {
          if (!result.ok) {
            console.warn("Email link sign-in failed", result.error);
            Alert.alert(
              "Sign-in link failed",
              result.error?.message || "This sign-in link is invalid or expired. Request a new one from login."
            );
          }
        });
      });

      return () => {
        subscription?.remove?.();
      };
    }, []);

    useEffect(() => {
      const unsubscribe = subscribeToSessionChanges((result) => {
        if (!result?.ok) {
          return;
        }
        authCtx.syncSessionUser(result.data);
      });

      return () => {
        unsubscribe?.();
      };
    }, []);

    useEffect(() => {
      const stopAutoSync = startOutboxAutoSync(outboxProcessors, {
        maxRetries: 3,
        baseDelayMs: 500,
      });

      const appStateSubscription = AppState.addEventListener("change", (state) => {
        if (state === "active") {
          syncOutbox(outboxProcessors, { maxRetries: 3, baseDelayMs: 500 });
        }
      });

      return () => {
        stopAutoSync?.();
        appStateSubscription?.remove?.();
      };
    }, []);

    if (isTryingLogin) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FAF3E0",
          }}
        >
          <Loader color="#1D9E75" />
        </View>
      );
    }

    return <AuthNavigation />;
  }

  return (
    <AuthContentProvider>
      <StatusBar style="dark" backgroundColor={"#FAF3E0"} />
      <Root />
    </AuthContentProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
