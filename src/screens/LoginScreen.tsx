import React, { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FirebaseError } from "firebase/app";

import { login } from "../services/authService";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getLoginErrorMessage = (error: unknown) => {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/configuration-not-found":
          return "Configuracao de login nao encontrada no Firebase. Ative Email/Senha em Authentication > Sign-in method.";

        case "auth/operation-not-allowed":
          return "Login por Email/Senha nao esta habilitado no Firebase Console.";

        case "auth/invalid-email":
          return "E-mail invalido.";

        case "auth/user-not-found":

        case "auth/wrong-password":

        case "auth/invalid-credential":
          return "E-mail ou senha incorretos.";

        case "auth/too-many-requests":
          return "Muitas tentativas. Tente novamente em alguns minutos.";

        case "auth/network-request-failed":
          return "Falha de rede. Verifique sua conexao.";

        default:
          return `Falha no login (${error.code}).`;
      }
    }

    return "Erro inesperado ao fazer login.";
  };

  const handleLogin = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      Alert.alert("Campos obrigatorios", "Preencha e-mail e senha.");
      return;
    }

    try {
      await login(normalizedEmail, password);
    } catch (error) {
      Alert.alert("Erro", getLoginErrorMessage(error));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bgBlobOne} />
          <View style={styles.bgBlobTwo} />

          <View style={styles.container}>
            <Text style={styles.brand}>NOTAS APP</Text>
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

            <View style={styles.card}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#72809B"
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#72809B"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
              />

              <Pressable style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Entrar</Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.secondaryButtonText}>Criar conta</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F8FF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  bgBlobOne: {
    position: "absolute",
    top: 0,
    left: -90,
    width: 250,
    height: 250,
    borderRadius: 130,
    backgroundColor: "#D4E7FF",
  },
  bgBlobTwo: {
    position: "absolute",
    bottom: 90,
    right: -20,
    width: 250,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#FFDCC5",
  },
  brand: {
    color: "#2A3F68",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#14203A",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: "#54637E",
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E7F1",
    gap: 10,
  },
  input: {
    backgroundColor: "#F7FAFF",
    borderWidth: 1,
    borderColor: "#D7E0EE",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#1C2740",
    fontSize: 16,
  },
  loginButton: {
    marginTop: 6,
    backgroundColor: "#1E3B70",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#F3F8FF",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D5DEEB",
  },
  secondaryButtonText: {
    color: "#2D456F",
    fontWeight: "700",
  },
});
