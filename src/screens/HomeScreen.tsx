import React, { useEffect, useState } from 'react';
import { View, Button, FlatList, Text } from 'react-native';
import { getNotes, deleteNote } from '../services/noteService';
import { logout } from '../services/authService';
export default function HomeScreen({ navigation }: any) {
 const [notes, setNotes] = useState<any[]>([]);
 const loadNotes = async () => {
   const data = await getNotes();
   setNotes(data);
 };
 useEffect(() => {
   loadNotes();
 }, []);
 return (
<View>
<Button title="Sair" onPress={logout} />
<Button title="Nova Nota" onPress={() => navigation.navigate('Note')} />
<FlatList
       data={notes}
       keyExtractor={(item) => item.id}
       renderItem={({ item }) => (
<View>
<Text>{item.title}</Text>
<Button title="Editar" onPress={() => navigation.navigate('Note', { note: item })} />
<Button title="Excluir" onPress={() => deleteNote(item.id).then(loadNotes)} />
</View>
       )}
     />
</View>
 );
}