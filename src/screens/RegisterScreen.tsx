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

import { useI18n } from "../hooks/useI18n";
import { register } from "../services/authService";

export default function RegisterScreen({ navigation }: any) {
  const { auth, common } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const getRegisterErrorMessage = (error: unknown) => {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/configuration-not-found":
          return auth.configurationNotFoundRegister;

        case "auth/email-already-in-use":
          return auth.emailAlreadyInUse;

        case "auth/invalid-email":
          return auth.invalidEmailRegister;

        case "auth/weak-password":
          return auth.weakPassword;

        case "auth/operation-not-allowed":
          return auth.operationNotAllowedRegister;
        default:
          return `Falha no cadastro (${error.code}).`;
      }
    }

    return auth.registerError;
  };

  const handleRegister = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert(common.error, common.fillFields);
      return;
    }

    try {
      setLoading(true);
      await register(normalizedEmail, password);
      Alert.alert(common.success, auth.accountCreated);
      navigation.goBack();
    } catch (error) {
      Alert.alert(common.error, getRegisterErrorMessage(error));
    } finally {
      setLoading(false);
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
            <Text style={styles.brand}>{common.appName}</Text>
            <Text style={styles.title}>{auth.register}</Text>
            <Text style={styles.subtitle}>{auth.subtitle}</Text>

            <View style={styles.card}>
              <TextInput
                style={styles.input}
                placeholder={auth.email}
                placeholderTextColor="#72809B"
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                editable={!loading}
              />
              <TextInput
                style={styles.input}
                placeholder={auth.password}
                placeholderTextColor="#72809B"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                editable={!loading}
              />

              <Pressable
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>{auth.register}</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.secondaryButton,
                  loading && styles.disabledButton,
                ]}
                onPress={() => navigation.goBack()}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>{auth.loginHere}</Text>
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
    backgroundColor: "#FFF8EF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  bgBlobOne: {
    position: "absolute",
    top: -70,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 130,
    backgroundColor: "#FFDDB8",
  },
  bgBlobTwo: {
    position: "absolute",
    bottom: -90,
    left: -70,
    width: 230,
    height: 230,
    borderRadius: 120,
    backgroundColor: "#D8ECFF",
  },
  brand: {
    color: "#674326",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#3B2615",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: "#705B4C",
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EFE2D4",
    gap: 10,
  },
  input: {
    backgroundColor: "#FFFCF9",
    borderWidth: 1,
    borderColor: "#E9DCCF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#422D1A",
    fontSize: 16,
  },
  primaryButton: {
    marginTop: 6,
    backgroundColor: "#6D4020",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFF9F2",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8DDD2",
  },
  secondaryButtonText: {
    color: "#6D4A31",
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
