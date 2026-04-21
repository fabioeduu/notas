import React, { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
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

import MapModal from "../components/MapModal";
import { useI18n } from "../hooks/useI18n";
import { useLocation } from "../hooks/useLocation";
import { createNote, updateNote } from "../services/noteService";
import { sendNotification } from "../services/notificationService";

export default function NoteScreen({ route, navigation }: any) {
  const { note: noteTexts, notifications, common } = useI18n();
  const {
    location,
    getLocation,
    loading: loadingLocation,
    error: locationError,
  } = useLocation();
  const note = route.params?.note;

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [saving, setSaving] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(common.error, "Digite um titulo para a nota.");
      return;
    }

    try {
      setSaving(true);
      if (note) {
        await updateNote(
          note.id,
          title.trim(),
          content.trim(),
          location?.latitude,
          location?.longitude,
          location?.address,
        );
      } else {
        await createNote(
          title.trim(),
          content.trim(),
          location?.latitude,
          location?.longitude,
          location?.address,
        );
        await sendNotification(
          notifications.noteCreated,
          notifications.noteCreatedMessage,
        );
      }
      navigation.goBack();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : noteTexts.saveError;
      Alert.alert(common.error, message);
    } finally {
      setSaving(false);
    }
  };

  const handleCaptureLocation = async () => {
    await getLocation(true);
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
              {note ? noteTexts.title : noteTexts.title}
            </Text>
            <Text style={styles.subtitle}>
              Escreva algo que voce nao quer esquecer.
            </Text>

            <View style={styles.card}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder={noteTexts.titlePlaceholder}
                placeholderTextColor="#7A879E"
              />

              <TextInput
                style={styles.input}
                value={content}
                onChangeText={setContent}
                placeholder={noteTexts.contentPlaceholder}
                placeholderTextColor="#7A879E"
                multiline
                textAlignVertical="top"
              />

              <View style={styles.locationRow}>
                <Pressable
                  style={styles.locationButton}
                  onPress={handleCaptureLocation}
                >
                  <Ionicons name="locate" size={16} color="#FFFFFF" />
                  <Text style={styles.locationButtonText}>
                    {loadingLocation ? common.loading : noteTexts.location}
                  </Text>
                </Pressable>

                {location && (
                  <Pressable
                    style={styles.mapButton}
                    onPress={() => setShowMap(true)}
                  >
                    <Ionicons name="map" size={16} color="#FFFFFF" />
                    <Text style={styles.locationButtonText}>
                      {noteTexts.viewMap}
                    </Text>
                  </Pressable>
                )}
              </View>

              {location && (
                <Text style={styles.coordinatesText}>
                  {noteTexts.coordinates}: {location.latitude.toFixed(4)},{" "}
                  {location.longitude.toFixed(4)}
                </Text>
              )}

              {locationError && (
                <Text style={styles.errorText}>{locationError}</Text>
              )}

              <Pressable
                style={styles.saveButton}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>{noteTexts.save}</Text>
              </Pressable>

              <Pressable
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>{common.cancel}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <MapModal
        visible={showMap}
        latitude={location?.latitude}
        longitude={location?.longitude}
        title={title}
        onClose={() => setShowMap(false)}
      />
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
    minHeight: 72,
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
  locationRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  locationButton: {
    flex: 1,
    backgroundColor: "#2F5CA9",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  mapButton: {
    flex: 1,
    backgroundColor: "#17803D",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  locationButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  coordinatesText: {
    fontSize: 12,
    color: "#2F5CA9",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: "#B91C1C",
    marginBottom: 10,
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
