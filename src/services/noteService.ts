import { db, auth } from '../../firebaseConfig';

import {
 collection,
 addDoc,
 getDocs,
 updateDoc,
 deleteDoc,
 doc,
 query,
 where
} from 'firebase/firestore';


const notesCollection = collection(db, 'notes');
export const createNote = async (title: string) => {
 const user = auth.currentUser;
 return addDoc(notesCollection, {
   title,
   userId: user?.uid,
   createdAt: new Date()
 });
};
export const getNotes = async () => {
 const user = auth.currentUser;
 const q = query(notesCollection, where('userId', '==', user?.uid));
 const snapshot = await getDocs(q);
 return snapshot.docs.map(doc => ({
   id: doc.id,
   ...doc.data()
 }));
};
export const updateNote = (id: string, title: string) => {
 const noteRef = doc(db, 'notes', id);
 return updateDoc(noteRef, { title });
};
export const deleteNote = (id: string) => {
 const noteRef = doc(db, 'notes', id);
 return deleteDoc(noteRef);
};