import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebaseAuth from "firebase/auth";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// 🔥 Variáveis obrigatórias
const requiredEnvVars = [
  "EXPO_PUBLIC_FIREBASE_API_KEY",
  "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "EXPO_PUBLIC_FIREBASE_APP_ID",
] as const;

// 🔍 Verifica se faltam variáveis
const missingVars = requiredEnvVars.filter(
  (envName) => !process.env[envName]
);

// ⚠️ NÃO QUEBRAR APP EM PRODUÇÃO
if (missingVars.length > 0) {
  if (__DEV__) {
    throw new Error(
      `Missing Firebase env vars: ${missingVars.join(", ")}`
    );
  } else {
    console.warn(
      "Firebase env vars faltando:",
      missingVars
    );
  }
}

// 🚫 placeholders inválidos
const invalidPlaceholders = [
  "SUA_API_KEY",
  "SEU_PROJECT",
  "SEU_PROJECT_ID",
  "SEU_STORAGE_BUCKET",
  "SEU_MESSAGING_SENDER_ID",
  "SEU_APP_ID",
];

// 🔍 valida valores
const assertValidFirebaseValue = (
  name: string,
  value: string | undefined
) => {
  if (!value) return;

  if (
    invalidPlaceholders.some((placeholder) =>
      value.includes(placeholder)
    )
  ) {
    const message = `Invalid Firebase env var: ${name} still uses placeholder`;

    if (__DEV__) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }
};

// 🔍 valida cada env
requiredEnvVars.forEach((env) => {
  assertValidFirebaseValue(env, process.env[env]);
});

// 🔍 valida API key
const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

if (apiKey && !apiKey.startsWith("AIza")) {
  const message =
    "Invalid Firebase API key: expected key starting with AIza";

  if (__DEV__) {
    throw new Error(message);
  } else {
    console.warn(message);
  }
}

// 🔥 Config Firebase
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

// 🔥 Init app
const app = initializeApp(firebaseConfig);

// 🔥 Auth (React Native)
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

// 🔥 Exports
export const auth = authInstance;
export const db = getFirestore(app);