import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  collaborators: [],
  tools: [],
  loans: [],
  currentView: 'home'
};

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_COLLABORATOR':
      return {
        ...state,
        collaborators: [...state.collaborators, action.payload]
      };
    case 'ADD_TOOL':
      return {
        ...state,
        tools: [...state.tools, action.payload]
      };
    case 'ADD_LOAN':
      return {
        ...state,
        loans: [...state.loans, action.payload]
      };
    case 'RETURN_TOOL':
      return {
        ...state,
        loans: state.loans.map(loan =>
          loan.id === action.payload.loanId
            ? { ...loan, returnDate: new Date().toISOString(), status: 'returned' }
            : loan
        )
      };
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload
      };
    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedData = localStorage.getItem('controle-ferramentas-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem('controle-ferramentas-data', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
} 