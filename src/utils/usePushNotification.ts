// src/utils/usePushNotification.ts
import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, VAPID_KEY } from "../firebaseConfig";

const BACKEND_URL = "/api/notifications/register-token";

interface UsePushNotificationReturn {
  fcmToken: string | null;
  permissionStatus: NotificationPermission;
  error: string | null;
  requestPermission: () => Promise<void>;
}

export const usePushNotification = (): UsePushNotificationReturn => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission>(Notification.permission);
  const [error, setError] = useState<string | null>(null);

  const sendTokenToBackend = async (token: string) => {
    try {
      await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fcmToken: token }),
      });
      console.log("✅ FCM token sent to backend");
    } catch (err) {
      console.error("❌ Failed to send token to backend:", err);
    }
  };

  const requestPermission = async () => {
    if (!messaging) {
      setError("Firebase messaging not supported");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === "granted") {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (token) {
          setFcmToken(token);
          await sendTokenToBackend(token);
        } else {
          setError("No FCM token received. Check VAPID key.");
        }
      } else {
        setError("Notification permission denied");
      }
    } catch (err) {
      setError("Error getting FCM token: " + err);
      console.error(err);
    }
  };

  useEffect(() => {
    if (Notification.permission === "granted") {
      requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!messaging) return;
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("[Foreground] Message received:", payload);
      if (Notification.permission === "granted") {
        new Notification(payload.notification?.title ?? "Notification", {
          body: payload.notification?.body,
          icon: payload.notification?.icon ?? "/logo.png",
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return { fcmToken, permissionStatus, error, requestPermission };
};
