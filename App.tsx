import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebaseConfig";

import LoginScreen from "./src/screens/LoginScreen";

import RegisterScreen from "./src/screens/RegisterScreen";

import HomeScreen from "./src/screens/HomeScreen";

import NoteScreen from "./src/screens/NoteScreen";

const Stack = createNativeStackNavigator();
export default function App() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);
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
              options={{ title: "Nota" }}
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
              options={{ title: "Cadastro" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
