# App de Notas
Aplicativo de notas, feito para checkpoint de mobile.


## Descricao do projeto

Aplicativo mobile desenvolvido em React Native com autenticacao de usuarios e CRUD de notas no Firebase.

Funcionalidades implementadas:

- Cadastro com e-mail e senha
- Login e logout
- Criacao de nota
- Listagem de notas do usuario logado
- Edicao de nota
- Exclusao de nota com confirmacao
- Indicador de carregamento na tela principal

Regra de negocio:

- Cada usuario visualiza e altera apenas as proprias notas
- Nao e possivel acessar a area de notas sem login

## Tecnologias utilizadas

- React Native
- Expo
- Firebase Authentication
- Cloud Firestore
- React Navigation
- TypeScript

## Como rodar o projeto

### 1. Clonar repositorio

```bash
git clone https://github.com/fabioeduu/notas.git
cd notas-app-novo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variaveis de ambiente

Crie um arquivo `.env` na raiz com o seguinte formato:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### 4. Configurar Firebase Authentication

No Firebase Console:

1. Authentication
2. Sign-in method
3. Ativar `Email/Password`

### 5. Configurar regras do Firestore

Publicar o arquivo [firestore.rules](firestore.rules) com o comando:

```bash
firebase deploy --only firestore:rules
```

### 6. Iniciar aplicacao

```bash
npm run start
```

## Video de demonstracao (max. 5 min)

Link do video:

- link aqui

## Integrantes

- Nome: Fabio H S Eduardo | RM:560416
- Nome: Renato Kenji Sugaki | RM:
- Nome: Gabriel Wu Castro | RM:560210


## Estrutura de telas

- Tela de Login
- Tela de Cadastro
- Tela principal com lista de notas
- Tela para criar/editar nota

## Obs:
- O projeto utiliza variaveis `EXPO_PUBLIC_*` para configuracao do Firebase.
- Em caso de erro `auth/configuration-not-found`, validar se o provedor Email/Senha esta habilitado no Authentication.
