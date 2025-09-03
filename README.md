# 🔧 Controle de Ferramentas - PWA

Um aplicativo Progressive Web App (PWA) para controle de uso e empréstimo de ferramentas, desenvolvido em React.

## 📱 Funcionalidades

### ✅ **Principais Recursos:**
- **Cadastro de Colaboradores** com nome e CPF
- **Cadastro de Ferramentas** com nome e status
- **Sistema de Empréstimo** com seleção múltipla de ferramentas
- **Assinatura Digital** automática do colaborador
- **Painel Administrativo** completo com:
  - Dashboard com estatísticas
  - Visualização de todos os colaboradores
  - Visualização de todas as ferramentas
  - Controle de empréstimos ativos
  - Função de devolução
- **Persistência de Dados** no localStorage
- **Interface Responsiva** para mobile e desktop

## 🚀 Como Usar

### **Pré-requisitos:**
- Node.js instalado
- npm ou yarn

### **Instalação e Execução:**

1. **Clone ou baixe o projeto**
2. **Navegue até o diretório:**
   ```bash
   cd controle-ferramentas
   ```

3. **Instale as dependências:**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Inicie o aplicativo:**
   ```bash
   npm start
   ```

5. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

## 📱 **Instalação como PWA no Celular:**

1. Abra `http://localhost:3000` no navegador do celular
2. Toque no menu do navegador (⋮)
3. Selecione "Adicionar à tela inicial"
4. O app funcionará como um aplicativo nativo!

## 🎯 **Fluxo de Uso:**

### **1. Cadastros Iniciais:**
- Cadastre colaboradores (Nome + CPF)
- Cadastre ferramentas (Nome da ferramenta)

### **2. Fazer Empréstimo:**
- Clique em "Iniciar Novo Empréstimo"
- Selecione o colaborador
- Selecione uma ou mais ferramentas
- Defina a data de devolução
- Confirme (assinatura digital automática)

### **3. Controle Administrativo:**
- Acesse o "Painel Administrativo"
- Visualize estatísticas no Dashboard
- Clique nas abas para ver:
  - 👥 **Colaboradores**: Lista completa com histórico
  - 🔧 **Ferramentas**: Lista completa com status
- Gerencie devoluções na seção de empréstimos ativos

## 📊 **Estrutura do Projeto:**

```
src/
├── components/
│   ├── Home.js                 # Tela inicial
│   ├── RegisterCollaborator.js # Cadastro de colaboradores
│   ├── RegisterTool.js         # Cadastro de ferramentas
│   ├── LoanTool.js            # Sistema de empréstimo
│   └── AdminPanel.js          # Painel administrativo
├── context/
│   └── AppContext.js          # Gerenciamento de estado global
├── App.js                     # Componente principal
├── App.css                    # Estilos globais
└── index.js                   # Ponto de entrada
```

## 💾 **Armazenamento de Dados:**

- **Local**: Todos os dados são salvos no `localStorage` do navegador
- **Persistência**: Os dados permanecem salvos entre sessões
- **Backup**: Para fazer backup, exporte os dados do localStorage

## 🎨 **Características do Design:**

- **Cores**: Gradiente moderno azul/roxo
- **Responsivo**: Adapta-se a mobile e desktop
- **Ícones**: Emojis para melhor UX
- **Animações**: Transições suaves
- **Tabelas**: Design profissional com cores diferenciadas

## 🔧 **Comandos Disponíveis:**

- `npm start` - Inicia o servidor de desenvolvimento
- `npm build` - Cria versão de produção
- `npm test` - Executa testes
- `npm run eject` - Ejeta configurações (irreversível)

## 📋 **Dados Armazenados:**

### **Colaboradores:**
- ID, Nome, CPF, Data de Cadastro

### **Ferramentas:**
- ID, Nome, Status, Data de Cadastro

### **Empréstimos:**
- ID, Colaborador, Ferramentas, Datas, Status, Assinatura Digital

## 🌐 **Tecnologias Utilizadas:**

- **React** 19.1.1
- **PWA** (Progressive Web App)
- **localStorage** para persistência
- **CSS3** com gradientes e animações
- **Responsive Design**

---

## 📞 **Suporte:**

Para dúvidas ou melhorias, consulte a documentação do código ou entre em contato.

**Status:** ✅ Projeto completo e funcional 