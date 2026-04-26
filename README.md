# App de Notas Pro

Aplicativo de notas em React Native com i18n, localização, mapa, notificações e build Android.

## Descricao do projeto

Aplicativo mobile desenvolvido em React Native com autenticacao de usuarios e CRUD de notas no Firebase.

Funcionalidades implementadas:

- Cadastro com e-mail e senha
- Login e logout
- Troca de idioma entre Português e Inglês
- Criacao de nota
- Listagem de notas do usuario logado
- Edicao de nota
- Exclusao de nota com confirmacao
- Indicador de carregamento na tela principal
- Captura automatica de latitude e longitude ao salvar a nota
- Persistencia das coordenadas no Firestore
- Visualizacao da nota em mapa com pin
- Notificacao de boas-vindas ao autenticar
- Notificacao de confirmacao ao criar nota
- Geracao de APK via EAS Build

Regra de negocio:

- Cada usuario visualiza e altera apenas as proprias notas
- Nao e possivel acessar a area de notas sem login

## Tecnologias utilizadas

- React Native
- Expo
- i18next
- Firebase Authentication
- Cloud Firestore
- React Navigation
- expo-location
- expo-notifications
- react-native-maps
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

## Build Android APK

Para gerar o APK de instalacao:

```bash
eas build -p android --profile preview
```

O perfil `preview` esta configurado para gerar `.apk`.

## Video de demonstracao.

## Link do video: 

## Fase 01 do projeto:

- 01 video mobile: https://youtube.com/shorts/HrdyIHgJtgY

- 02 video firebase: https://youtu.be/UT0ByFGjR6c

## Fase 02 do projeto:

- 01 video mobile: https://youtube.com/shorts/61NdlsfnDeE

- 02 video firebase: https://youtu.be/6WxyaO1_GOM

## Android App:

- APK: https://expo.dev/artifacts/eas/jTp41eNyAydZQdDttrBBFb.apk



## Integrantes

- Nome: Fabio H S Eduardo | RM:560416
- Nome: Renato Kenji Sugaki | RM:559810
- Nome: Gabriel Wu Castro | RM:560210

## Estrutura de telas

- Tela de Login
- Tela de Cadastro
- Tela principal com lista de notas
- Tela para criar/editar nota

## Obs:

- O projeto utiliza variaveis `EXPO_PUBLIC_*` para configuracao do Firebase.
- Em caso de erro `auth/configuration-not-found`, validar se o provedor Email/Senha esta habilitado no Authentication.
- Para testar o mapa, use um Development Build ou o APK gerado via EAS.
