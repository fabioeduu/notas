import { auth, db } from "../../firebaseConfig";
import i18n from "./i18nService";

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

export type NoteDoc = {
  title: string;
  userId: string;
  createdAt: Date;
  content?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
};

const notesCollection = collection(db, "notes");

const getCurrentUserId = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error(i18n.t("note.userNotAuthenticated"));
  }
  return userId;
};

const assertNoteOwnership = async (id: string, userId: string) => {
  const noteRef = doc(db, "notes", id);
  const noteSnapshot = await getDoc(noteRef);

  if (!noteSnapshot.exists()) {
    throw new Error(i18n.t("note.noteNotFound"));
  }

  const noteData = noteSnapshot.data() as Partial<NoteDoc>;
  if (noteData.userId !== userId) {
    throw new Error(i18n.t("note.noPermissionToUpdate"));
  }

  return noteRef;
};

export const createNote = async (
  title: string,
  content?: string,
  latitude?: number,
  longitude?: number,
  address?: string,
) => {
  const userId = getCurrentUserId();
  return addDoc(notesCollection, {
    title,
    content: content || "",
    userId,
    createdAt: new Date(),
    latitude,
    longitude,
    address,
  });
};

export const getNotes = async () => {
  const userId = getCurrentUserId();
  const q = query(notesCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((noteDoc) => ({
    id: noteDoc.id,
    ...noteDoc.data(),
  }));
};

export const updateNote = async (
  id: string,
  title: string,
  content?: string,
  latitude?: number,
  longitude?: number,
  address?: string,
) => {
  const userId = getCurrentUserId();
  const noteRef = await assertNoteOwnership(id, userId);
  return updateDoc(noteRef, {
    title,
    content: content || "",
    latitude,
    longitude,
    address,
  });
};

export const deleteNote = async (id: string) => {
  const userId = getCurrentUserId();
  const noteRef = await assertNoteOwnership(id, userId);
  return deleteDoc(noteRef);
};

export const getNote = async (id: string) => {
  const userId = getCurrentUserId();
  const noteRef = doc(db, "notes", id);
  const noteSnapshot = await getDoc(noteRef);

  if (!noteSnapshot.exists()) {
    throw new Error(i18n.t("note.noteNotFound"));
  }

  const noteData = noteSnapshot.data() as Partial<NoteDoc>;
  if (noteData.userId !== userId) {
    throw new Error(i18n.t("note.noPermissionToAccess"));
  }

  return {
    id: noteSnapshot.id,
    ...noteData,
  };
};
