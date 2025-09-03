import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ===== COLABORADORES =====
export const addCollaborator = async (collaborator) => {
  try {
    const docRef = await addDoc(collection(db, 'collaborators'), {
      ...collaborator,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...collaborator };
  } catch (error) {
    console.error('Erro ao adicionar colaborador:', error);
    throw error;
  }
};

export const getCollaborators = async () => {
  try {
    const q = query(collection(db, 'collaborators'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Erro ao buscar colaboradores:', error);
    return [];
  }
};

// ===== FERRAMENTAS =====
export const addTool = async (tool) => {
  try {
    const docRef = await addDoc(collection(db, 'tools'), {
      ...tool,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...tool };
  } catch (error) {
    console.error('Erro ao adicionar ferramenta:', error);
    throw error;
  }
};

export const getTools = async () => {
  try {
    const q = query(collection(db, 'tools'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Erro ao buscar ferramentas:', error);
    return [];
  }
};

// ===== EMPRÉSTIMOS =====
export const addLoan = async (loan) => {
  try {
    const docRef = await addDoc(collection(db, 'loans'), {
      ...loan,
      loanDate: serverTimestamp(),
      status: 'active'
    });
    return { id: docRef.id, ...loan };
  } catch (error) {
    console.error('Erro ao adicionar empréstimo:', error);
    throw error;
  }
};

export const getLoans = async () => {
  try {
    const q = query(collection(db, 'loans'), orderBy('loanDate', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      loanDate: doc.data().loanDate?.toDate?.()?.toISOString() || new Date().toISOString(),
      returnDate: doc.data().returnDate?.toDate?.()?.toISOString() || null
    }));
  } catch (error) {
    console.error('Erro ao buscar empréstimos:', error);
    return [];
  }
};

export const returnTool = async (loanId) => {
  try {
    const loanRef = doc(db, 'loans', loanId);
    await updateDoc(loanRef, {
      status: 'returned',
      returnDate: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Erro ao devolver ferramenta:', error);
    throw error;
  }
};

// ===== LISTENERS EM TEMPO REAL =====
export const subscribeToCollaborators = (callback) => {
  const q = query(collection(db, 'collaborators'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const collaborators = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));
    callback(collaborators);
  });
};

export const subscribeToTools = (callback) => {
  const q = query(collection(db, 'tools'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const tools = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));
    callback(tools);
  });
};

export const subscribeToLoans = (callback) => {
  const q = query(collection(db, 'loans'), orderBy('loanDate', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const loans = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      loanDate: doc.data().loanDate?.toDate?.()?.toISOString() || new Date().toISOString(),
      returnDate: doc.data().returnDate?.toDate?.()?.toISOString() || null
    }));
    callback(loans);
  });
}; 