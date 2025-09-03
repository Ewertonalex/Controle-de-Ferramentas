import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase - Configurações reais do projeto
const firebaseConfig = {
  apiKey: "AIzaSyB63qKvG4iz9DcTW34OGxVYMANDYM4S0Jk",
  authDomain: "controle-ferramentas-de7bc.firebaseapp.com",
  projectId: "controle-ferramentas-de7bc",
  storageBucket: "controle-ferramentas-de7bc.firebasestorage.app",
  messagingSenderId: "1719125607",
  appId: "1:1719125607:web:1c414518d83d3a3eb676c2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app; 