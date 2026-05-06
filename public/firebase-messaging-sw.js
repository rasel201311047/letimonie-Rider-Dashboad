// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBbOaUSOuVTFTedtK__NefFZ2jYQITcJj0",
  authDomain: "ride-share-dashboad.firebaseapp.com",
  projectId: "ride-share-dashboad",
  storageBucket: "ride-share-dashboad.firebasestorage.app",
  messagingSenderId: "515219360015",
  appId: "1:515219360015:web:ee862179bc52e9b00b967a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);
  const { title, body, icon } = payload.notification ?? {};
  self.registration.showNotification(title ?? "New Notification", {
    body: body ?? "",
    icon: icon ?? "/logo.png",
    badge: "/logo.png",
    data: payload.data,
  });
});
