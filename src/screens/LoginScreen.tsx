import React, { useState } from 'react';

import { View, TextInput, Button, Alert } from 'react-native';

import { login } from '../services/authService';


export default function LoginScreen({ navigation }: any) {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const handleLogin = async () => {
   try {
     await login(email, password);
   } catch (error) {
     Alert.alert('Erro', 'Login inválido');
   }
 };

 
 return (
<View>
<TextInput placeholder="Email" onChangeText={setEmail} />
<TextInput placeholder="Senha" secureTextEntry onChangeText={setPassword} />
<Button title="Login" onPress={handleLogin} />
<Button title="Cadastrar" onPress={() => navigation.navigate('Register')} />
</View>
 );
}