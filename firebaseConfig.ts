import { initializeApp } from "firebase/app";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebaseAuth from "firebase/auth";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const requiredEnvVars = [
  "EXPO_PUBLIC_FIREBASE_API_KEY",
  "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "EXPO_PUBLIC_FIREBASE_APP_ID",
] as const;

const missingVars = requiredEnvVars.filter((envName) => !process.env[envName]);

if (missingVars.length > 0) {
  throw new Error(`Missing Firebase env vars: ${missingVars.join(", ")}`);
}

const invalidPlaceholders = [
  "SUA_API_KEY",
  "SEU_PROJECT",
  "SEU_PROJECT_ID",
  "SEU_STORAGE_BUCKET",
  "SEU_MESSAGING_SENDER_ID",
  "SEU_APP_ID",
];

const assertValidFirebaseValue = (name: string, value: string | undefined) => {
  if (!value) {
    return;
  }

  if (invalidPlaceholders.some((placeholder) => value.includes(placeholder))) {
    throw new Error(
      `Invalid Firebase env var: ${name} still uses a placeholder value.`,
    );
  }
};

assertValidFirebaseValue(
  "EXPO_PUBLIC_FIREBASE_API_KEY",
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
);
assertValidFirebaseValue(
  "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
);
assertValidFirebaseValue(
  "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
);
assertValidFirebaseValue(
  "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
  process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
);
assertValidFirebaseValue(
  "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
);
assertValidFirebaseValue(
  "EXPO_PUBLIC_FIREBASE_APP_ID",
  process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
);

if (
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY &&
  !process.env.EXPO_PUBLIC_FIREBASE_API_KEY.startsWith("AIza")
) {
  throw new Error(
    "Invalid Firebase API key: expected a Google/Firebase web API key (usually starts with AIza).",
  );
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const getReactNativePersistence = (firebaseAuth as any)
  .getReactNativePersistence;

let authInstance: Auth;

if (Platform.OS === "web") {
  authInstance = getAuth(app);
} else {
  try {
    if (typeof getReactNativePersistence === "function") {
      authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage) as any,
      });
    } else {
      authInstance = getAuth(app);
    }
  } catch {
    authInstance = getAuth(app);
  }
}

export const auth = authInstance;

export const db = getFirestore(app);
