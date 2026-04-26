import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";

import { auth } from "./firebaseConfig";
import { I18nProvider } from "./src/contexts/I18nContext";
import "./src/services/i18nService";

import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import MapViewScreen from "./src/screens/MapViewScreen";
import NoteScreen from "./src/screens/NoteScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#FFF9F1" },
          headerTitleStyle: { fontWeight: "700", color: "#1B2540" },
          headerTintColor: "#1B2540",
          contentStyle: { backgroundColor: "#FFF9F1" },
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Note"
              component={NoteScreen}
              options={{ title: t("note.title") }}
            />
            <Stack.Screen
              name="MapView"
              component={MapViewScreen}
              options={{ title: t("map.title") }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: t("auth.register") }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <RootNavigator />
    </I18nProvider>
  );
}