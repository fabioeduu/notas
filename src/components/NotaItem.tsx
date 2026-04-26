import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useI18n } from "../hooks/useI18n";

type Note = {
  id: string;
  title: string;
  content?: string;
  createdAt?: any;
  latitude?: number;
  longitude?: number;
};

type NotaItemProps = {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
};

export default function NotaItem({ note, onPress, onDelete }: NotaItemProps) {
  const { note: noteTexts, common } = useI18n();
  const createdAt = note.createdAt?.toDate?.() ?? undefined;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title || noteTexts.noTitle}
        </Text>
        {note.content ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {note.content}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <Text style={styles.dateText}>
            {createdAt ? createdAt.toLocaleDateString() : ""}
          </Text>
          {note.latitude != null && note.longitude != null ? (
            <View style={styles.locationBadge}>
              <Ionicons name="location" size={12} color="#FFFFFF" />
              <Text style={styles.locationText}>
                {note.latitude.toFixed(2)}, {note.longitude.toFixed(2)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Pressable
        style={[styles.button, styles.deleteButton]}
        onPress={onDelete}
      >
        <Text style={styles.deleteButtonText}>{common.delete}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#172033",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#4A556B",
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  dateText: {
    fontSize: 11,
    color: "#64748B",
  },
  locationBadge: {
    backgroundColor: "#17803D",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  button: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#FFECEF",
  },
  deleteButtonText: {
    color: "#A82A3E",
    fontWeight: "700",
    fontSize: 12,
  },
});
