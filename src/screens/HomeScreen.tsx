import { Ionicons } from "@expo/vector-icons";
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
import { useI18nContext } from "../contexts/I18nContext";
import { useI18n } from "../hooks/useI18n";
import { logout } from "../services/authService";
import { deleteNote, getNotes } from "../services/noteService";

export default function HomeScreen({ navigation }: any) {
  const { home, common } = useI18n();
  const { language, setLanguage } = useI18nContext();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : home.loadError;
      Alert.alert(common.error, message);
    } finally {
      setLoading(false);
    }
  }, [common.error, home.loadError]);

  useFocusEffect(
    useCallback(() => {
      void loadNotes();
    }, [loadNotes]),
  );

  const handleDelete = (id: string) => {
    Alert.alert(home.deleteConfirm, home.deleteMessage, [
      { text: home.cancelDelete, style: "cancel" },
      {
        text: home.confirmDelete,
        style: "destructive",
        onPress: async () => {
          try {
            await deleteNote(id);
            await loadNotes();
          } catch (error) {
            const message =
              error instanceof Error ? error.message : home.deleteError;
            Alert.alert(common.error, message);
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleLanguageChange = async () => {
    await setLanguage(language === "pt" ? "en" : "pt");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bgCircleOne} />
      <View style={styles.bgCircleTwo} />

      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{home.title}</Text>
            <Text style={styles.subtitle}>{home.subtitle}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              style={styles.languageButton}
              onPress={handleLanguageChange}
            >
              <Text style={styles.languageButtonText}>
                {language === "pt" ? "EN" : "PT"}
              </Text>
            </Pressable>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={16} color="#8C3A20" />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={styles.newNoteButton}
          onPress={() => navigation.navigate("Note")}
        >
          <Text style={styles.newNoteButtonText}>{home.newNote}</Text>
        </Pressable>

        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                {loading ? common.loading : home.emptyTitle}
              </Text>
              {!loading && (
                <Text style={styles.emptySubtitle}>{home.emptyMessage}</Text>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <NotaItem
              note={item}
              onPress={() => navigation.navigate("Note", { note: item })}
              onDelete={() => handleDelete(item.id)}
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
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  languageButton: {
    backgroundColor: "#1E3050",
    borderRadius: 14,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  languageButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
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
