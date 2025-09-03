# 🔥 Guia de Configuração do Firebase

## 📋 Passo a Passo Completo

### 1️⃣ Criar Projeto no Firebase Console
1. Acesse: https://console.firebase.google.com/
2. Clique em **"Criar um projeto"** ou **"Add project"**
3. Nome do projeto: `controle-ferramentas-[seunome]` (exemplo: controle-ferramentas-ewerton)
4. Desabilite o Google Analytics (não é necessário)
5. Clique em **"Criar projeto"**

### 2️⃣ Configurar Firestore Database
1. No painel lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Começar no modo de teste"** (permite leitura/escrita por 30 dias)
4. Escolha a localização: **"us-central1"** (mais próximo do Brasil disponível)
5. Clique em **"Concluído"**

### 3️⃣ Configurar App Web
1. No painel principal, clique no ícone **"Web"** (`</>`)
2. Nome do app: `Controle de Ferramentas PWA`
3. ✅ Marque **"Configurar também o Firebase Hosting para este app"**
4. Clique em **"Registrar app"**

### 4️⃣ Copiar Configurações
Você verá um código similar a este:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnop",
  authDomain: "controle-ferramentas-ewerton.firebaseapp.com",
  projectId: "controle-ferramentas-ewerton",
  storageBucket: "controle-ferramentas-ewerton.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

### 5️⃣ Atualizar Arquivo de Configuração
1. Abra o arquivo: `src/firebase/config.js`
2. Substitua as configurações de exemplo pelas suas configurações reais
3. Salve o arquivo

### 6️⃣ Regras de Segurança do Firestore
No Firebase Console, vá em **Firestore Database > Regras** e cole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para todos (temporário para desenvolvimento)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Importante**: Estas regras são para desenvolvimento. Para produção, configure regras mais restritivas.

### 7️⃣ Configurar Firebase Hosting (para deploy)
No terminal, dentro da pasta do projeto:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Fazer login
firebase login

# Inicializar projeto
firebase init

# Selecionar:
# ✅ Firestore
# ✅ Hosting

# Build do projeto
npm run build

# Deploy
firebase deploy
```

## 🚀 Deploy Automático no Netlify (Alternativa Mais Fácil)

### Opção 1: Deploy via GitHub
1. Faça push do código para o GitHub
2. Acesse: https://netlify.com
3. Clique em **"New site from Git"**
4. Conecte com GitHub e selecione seu repositório
5. Configurações de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
6. Clique em **"Deploy site"**

### Opção 2: Deploy via Drag & Drop
1. Execute: `npm run build`
2. Acesse: https://netlify.com
3. Arraste a pasta `build` para a área de drop
4. Site estará online em segundos!

## 📱 Como Instalar o PWA no Celular

### Android (Chrome/Edge):
1. Abra o site no navegador
2. Toque no menu (3 pontos)
3. Toque em **"Instalar app"** ou **"Adicionar à tela inicial"**
4. Confirme a instalação

### iPhone (Safari):
1. Abra o site no Safari
2. Toque no botão **Compartilhar** (quadrado com seta)
3. Toque em **"Adicionar à Tela de Início"**
4. Toque em **"Adicionar"**

## 🔐 Variáveis de Ambiente (Opcional - Mais Seguro)

Para maior segurança, crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_FIREBASE_API_KEY=sua_api_key_aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

E atualize `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

## ✅ Checklist Final

- [ ] Projeto Firebase criado
- [ ] Firestore Database configurado
- [ ] App Web registrado
- [ ] Configurações copiadas para `src/firebase/config.js`
- [ ] Regras do Firestore configuradas
- [ ] Projeto testado localmente (`npm start`)
- [ ] Deploy realizado (Netlify ou Firebase Hosting)
- [ ] PWA testado no celular

## 🆘 Problemas Comuns

### Erro: "Firebase: No Firebase App '[DEFAULT]' has been created"
- Verifique se as configurações no `src/firebase/config.js` estão corretas

### Erro: "Missing or insufficient permissions"
- Verifique as regras do Firestore Database

### PWA não aparece para instalar
- Certifique-se que está usando HTTPS (Netlify fornece automaticamente)
- Verifique se o manifest.json está correto

### Dados não sincronizam
- Verifique a conexão com internet
- Abra o console do navegador para ver erros

## 📞 Suporte

Se tiver problemas:
1. Verifique o console do navegador (F12)
2. Verifique se o Firebase está configurado corretamente
3. Teste a conexão com internet
4. Verifique se as regras do Firestore permitem acesso 