import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Note = {
  id: string;
  title: string;
};

type NotaItemProps = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
};

export default function NotaItem({ note, onEdit, onDelete }: NotaItemProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>
        {note.title || "Sem titulo"}
      </Text>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.editButton]}
          onPress={() => onEdit(note)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.deleteButton]}
          onPress={() => onDelete(note.id)}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </Pressable>
      </View>
    </View>
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
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#172033",
    marginBottom: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#EAF2FF",
  },
  deleteButton: {
    backgroundColor: "#FFECEF",
  },
  editButtonText: {
    color: "#274472",
    fontWeight: "700",
  },
  deleteButtonText: {
    color: "#A82A3E",
    fontWeight: "700",
  },
});
