import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotaItem from "../components/NotaItem";
import { logout } from "../services/authService";
import { deleteNote, getNotes } from "../services/noteService";

export default function HomeScreen({ navigation }: any) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, []),
  );

  const handleDelete = (id: string) => {
    Alert.alert("Excluir nota", "Tem certeza que deseja excluir esta nota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => deleteNote(id).then(loadNotes),
      },
    ]);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bgCircleOne} />
      <View style={styles.bgCircleTwo} />

      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Suas notas</Text>
            <Text style={styles.subtitle}>
              Organize ideias de forma simples
            </Text>
          </View>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.newNoteButton}
          onPress={() => navigation.navigate("Note")}
        >
          <Text style={styles.newNoteButtonText}>+ Nova nota</Text>
        </Pressable>

        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                {loading ? "Carregando..." : "Nenhuma nota ainda"}
              </Text>
              {!loading && (
                <Text style={styles.emptySubtitle}>
                  Toque em Nova nota para comecar.
                </Text>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <NotaItem
              note={item}
              onEdit={(note) => navigation.navigate("Note", { note })}
              onDelete={handleDelete}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF9F1",
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  bgCircleOne: {
    position: "absolute",
    top: -85,
    right: -75,
    width: 220,
    height: 220,
    borderRadius: 120,
    backgroundColor: "#FFE0B6",
  },
  bgCircleTwo: {
    position: "absolute",
    bottom: -60,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#D8EDFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#172033",
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    color: "#51607A",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E9E2D9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: "#8C3A20",
    fontWeight: "700",
  },
  newNoteButton: {
    backgroundColor: "#1E3050",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  newNoteButtonText: {
    color: "#F7FAFF",
    fontSize: 16,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 36,
    flexGrow: 1,
  },
  emptyCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ECE3DA",
    padding: 20,
    marginTop: 10,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3050",
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    color: "#5E6C85",
  },
});
