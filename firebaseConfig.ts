import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebaseAuth from "firebase/auth";
import {
  getAuth,
  initializeAuth,
  type Auth,
} from "firebase/auth";
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

const missingVars = requiredEnvVars.filter(
  (env) => !process.env[env]
);

if (missingVars.length > 0) {
  const message = `Missing Firebase env vars: ${missingVars.join(", ")}`;

  if (__DEV__) {
    throw new Error(message);
  } else {
    console.warn(message);
  }
}

const invalidPlaceholders = [
  "SUA_API_KEY",
  "SEU_PROJECT",
  "SEU_PROJECT_ID",
  "SEU_STORAGE_BUCKET",
  "SEU_MESSAGING_SENDER_ID",
  "SEU_APP_ID",
];

const assertValidFirebaseValue = (
  name: string,
  value: string | undefined
) => {
  if (!value) return;

  const isInvalid = invalidPlaceholders.some((placeholder) =>
    value.includes(placeholder)
  );

  if (isInvalid) {
    const message = `Invalid Firebase env var: ${name}`;

    if (__DEV__) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }
};

requiredEnvVars.forEach((env) => {
  assertValidFirebaseValue(env, process.env[env]);
});

const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

if (apiKey && !apiKey.startsWith("AIza")) {
  const message = "Invalid Firebase API key";

  if (__DEV__) {
    throw new Error(message);
  } else {
    console.warn(message);
  }
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
        persistence: getReactNativePersistence(AsyncStorage),
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