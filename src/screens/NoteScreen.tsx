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

import { createNote, updateNote } from "../services/noteService";

export default function NoteScreen({ route, navigation }: any) {
  const note = route.params?.note;

  const [title, setTitle] = useState(note?.title || "");

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Campo obrigatorio", "Digite um titulo para a nota.");
      return;
    }

    try {
      if (note) {
        await updateNote(note.id, title.trim());
      } else {
        await createNote(title.trim());
      }
      navigation.goBack();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar a nota.";
      Alert.alert("Erro", message);
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
          <View style={styles.bgCircleOne} />
          <View style={styles.bgCircleTwo} />

          <View style={styles.container}>
            <Text style={styles.title}>
              {note ? "Editar nota" : "Nova nota"}
            </Text>
            <Text style={styles.subtitle}>
              Escreva algo que voce nao quer esquecer.
            </Text>

            <View style={styles.card}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Digite sua nota aqui"
                placeholderTextColor="#7A879E"
                multiline
                textAlignVertical="top"
              />

              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </Pressable>

              <Pressable
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
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
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F8FF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  bgCircleOne: {
    position: "absolute",
    top: -0,
    right: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#DDE8FF",
  },
  bgCircleTwo: {
    position: "absolute",
    bottom: 80,
    left: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FFE6CD",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1B2540",
    letterSpacing: -0.7,
  },
  subtitle: {
    marginTop: 5,
    marginBottom: 16,
    fontSize: 14,
    color: "#566482",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E1E8F6",
    padding: 14,
  },
  input: {
    minHeight: 180,
    backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: "#D7E1F2",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#1F2B45",
    fontSize: 16,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#24447A",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 13,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#F3F8FF",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#CFD9EA",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 13,
  },
  cancelButtonText: {
    color: "#3A4D71",
    fontWeight: "700",
  },
});
