import { auth, db } from "../../firebaseConfig";

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

type NoteDoc = {
  title: string;
  userId: string;
  createdAt: Date;
};

const notesCollection = collection(db, "notes");

const getCurrentUserId = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("Usuario nao autenticado.");
  }
  return userId;
};

const assertNoteOwnership = async (id: string, userId: string) => {
  const noteRef = doc(db, "notes", id);
  const noteSnapshot = await getDoc(noteRef);

  if (!noteSnapshot.exists()) {
    throw new Error("Nota nao encontrada.");
  }

  const noteData = noteSnapshot.data() as Partial<NoteDoc>;
  if (noteData.userId !== userId) {
    throw new Error("Sem permissao para alterar esta nota.");
  }

  return noteRef;
};

export const createNote = async (title: string) => {
  const userId = getCurrentUserId();
  return addDoc(notesCollection, {
    title,
    userId,
    createdAt: new Date(),
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

export const updateNote = async (id: string, title: string) => {
  const userId = getCurrentUserId();
  const noteRef = await assertNoteOwnership(id, userId);
  return updateDoc(noteRef, { title });
};

export const deleteNote = async (id: string) => {
  const userId = getCurrentUserId();
  const noteRef = await assertNoteOwnership(id, userId);
  return deleteDoc(noteRef);
};
