import React, { useState } from 'react';

import { View, TextInput, Button, Alert } from 'react-native';

import { register } from '../services/authService';

export default function RegisterScreen({ navigation }: any) {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const handleRegister = async () => {
   try {
     await register(email, password);
     Alert.alert('Sucesso', 'Conta criada!');
     navigation.goBack();
   } catch {
     Alert.alert('Erro', 'Erro ao cadastrar');
   }
 };

 
 return (
<View>
<TextInput placeholder="Email" onChangeText={setEmail} />
<TextInput placeholder="Senha" secureTextEntry onChangeText={setPassword} />
<Button title="Cadastrar" onPress={handleRegister} />
</View>
 );
}