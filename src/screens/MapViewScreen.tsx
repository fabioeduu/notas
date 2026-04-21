import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useI18n } from "../hooks/useI18n";
import { getNote } from "../services/noteService";

export default function MapViewScreen({ route, navigation }: any) {
  const { noteId } = route.params || {};
  const { note: i18nNote, map } = useI18n();
  const [loading, setLoading] = useState(true);
  const [noteData, setNoteData] = useState<any>(null);

  let MapViewComponent: any = null;
  let MarkerComponent: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mapsModule = require("react-native-maps");
    MapViewComponent = mapsModule.default;
    MarkerComponent = mapsModule.Marker;
  } catch {
    MapViewComponent = null;
    MarkerComponent = null;
  }

  const loadNote = useCallback(async () => {
    try {
      setLoading(true);
      if (noteId) {
        const data = await getNote(noteId);
        setNoteData(data);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : i18nNote.saveError;
      Alert.alert("Erro", message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [i18nNote.saveError, navigation, noteId]);

  useEffect(() => {
    void loadNote();
  }, [loadNote]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  if (!noteData || !noteData.latitude || !noteData.longitude) {
    return (
      <SafeAreaView style={styles.center}>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color="#999" />
        </View>
      </SafeAreaView>
    );
  }

  if (!MapViewComponent || !MarkerComponent) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.unavailableText}>{map.unavailable}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapViewComponent
        style={styles.map}
        initialRegion={{
          latitude: noteData.latitude,
          longitude: noteData.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <MarkerComponent
          coordinate={{
            latitude: noteData.latitude,
            longitude: noteData.longitude,
          }}
          title={noteData.title}
          description={`Lat: ${noteData.latitude?.toFixed(4)}, Lng: ${noteData.longitude?.toFixed(4)}`}
        />
      </MapViewComponent>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  unavailableText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
