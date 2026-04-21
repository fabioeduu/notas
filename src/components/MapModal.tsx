import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useI18n } from "../hooks/useI18n";

interface MapModalProps {
  visible: boolean;
  latitude?: number;
  longitude?: number;
  title?: string;
  onClose: () => void;
}

/**
 * Modal para visualizar o mapa da nota
 * Mostra a localização onde a nota foi criada
 */
export default function MapModal({
  visible,
  latitude,
  longitude,
  title,
  onClose,
}: MapModalProps) {
  const { map, note } = useI18n();
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (visible) {
      setLoading(false);
    }
  }, [visible]);

  const hasLocation = latitude !== undefined && longitude !== undefined;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.title}>{map.title}</Text>
          <View style={styles.placeholder} />
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        )}

        {hasLocation && MapViewComponent && MarkerComponent ? (
          <MapViewComponent
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onLoadEnd={() => setLoading(false)}
          >
            <MarkerComponent
              coordinate={{ latitude: latitude!, longitude: longitude! }}
              title={title || map.noteLocation}
              description={`${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}`}
            />
          </MapViewComponent>
        ) : hasLocation ? (
          <View style={styles.noLocationContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={64}
              color="#ccc"
              style={styles.icon}
            />
            <Text style={styles.noLocationText}>{map.unavailable}</Text>
          </View>
        ) : (
          <View style={styles.noLocationContainer}>
            <Ionicons
              name="location-outline"
              size={64}
              color="#ccc"
              style={styles.icon}
            />
            <Text style={styles.noLocationText}>{note.noLocation}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#6366f1",
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  placeholder: {
    width: 40,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noLocationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  icon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  noLocationText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
});
