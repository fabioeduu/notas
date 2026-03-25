import React, { useState } from 'react';

import { View, TextInput, Button } from 'react-native';

import { createNote, updateNote } from '../services/noteService';

export default function NoteScreen({ route, navigation }: any) {

  const note = route.params?.note;

  const [title, setTitle] = useState(note?.title || '');

  const handleSave = async () => {

    if (note) {

      await updateNote(note.id, title);

    } else {

      await createNote(title);

    }
    navigation.goBack();

  };

  return (
<View>
<TextInput value={title} onChangeText={setTitle} placeholder="Nota" />
<Button title="Salvar" onPress={handleSave} />
</View>

  );
}
 