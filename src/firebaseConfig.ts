// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import type { Messaging } from "firebase/messaging"; // ✅ type-only import

const firebaseConfig = {
  apiKey: "AIzaSyBbOaUSOuVTFTedtK__NefFZ2jYQITcJj0",
  authDomain: "ride-share-dashboad.firebaseapp.com",
  projectId: "ride-share-dashboad",
  storageBucket: "ride-share-dashboad.firebasestorage.app",
  messagingSenderId: "515219360015",
  appId: "1:515219360015:web:ee862179bc52e9b00b967a",
};

const app = initializeApp(firebaseConfig);

let messaging: Messaging | null = null;
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export { app, messaging };

export const VAPID_KEY =
  "BFeaAOzZMJI7EhopxQG_lmLPXjtHLWKGdWXl6JhgqTvacX834feF" +
  "mYkNIlSRpRTJyNAffRNyTbszy1HC9iPH5xY";
