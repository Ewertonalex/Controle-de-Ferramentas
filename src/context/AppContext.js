import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  addCollaborator as addCollaboratorDB,
  addTool as addToolDB,
  addLoan as addLoanDB,
  returnTool as returnToolDB,
  subscribeToCollaborators,
  subscribeToTools,
  subscribeToLoans
} from '../services/database';

const AppContext = createContext();

const initialState = {
  currentView: 'home',
  collaborators: [],
  tools: [],
  loans: [],
  loading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_COLLABORATORS':
      return { ...state, collaborators: action.payload };
    
    case 'SET_TOOLS':
      return { ...state, tools: action.payload };
    
    case 'SET_LOANS':
      return { ...state, loans: action.payload };
    
    case 'ADD_COLLABORATOR':
      return {
        ...state,
        collaborators: [action.payload, ...state.collaborators]
      };
    
    case 'ADD_TOOL':
      return {
        ...state,
        tools: [action.payload, ...state.tools]
      };
    
    case 'ADD_LOAN':
      return {
        ...state,
        loans: [action.payload, ...state.loans]
      };
    
    case 'RETURN_TOOL':
      return {
        ...state,
        loans: state.loans.map(loan =>
          loan.id === action.payload.loanId
            ? { ...loan, status: 'returned', returnDate: new Date().toISOString() }
            : loan
        )
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Configurar listeners em tempo real do Firebase
  useEffect(() => {
    const unsubscribeCollaborators = subscribeToCollaborators((collaborators) => {
      dispatch({ type: 'SET_COLLABORATORS', payload: collaborators });
    });

    const unsubscribeTools = subscribeToTools((tools) => {
      dispatch({ type: 'SET_TOOLS', payload: tools });
    });

    const unsubscribeLoans = subscribeToLoans((loans) => {
      dispatch({ type: 'SET_LOANS', payload: loans });
    });

    // Cleanup listeners
    return () => {
      unsubscribeCollaborators();
      unsubscribeTools();
      unsubscribeLoans();
    };
  }, []);

  // Actions com Firebase
  const actions = {
    async addCollaborator(collaborator) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const newCollaborator = await addCollaboratorDB({
          name: collaborator.name,
          cpf: collaborator.cpf
        });
        dispatch({ type: 'SET_LOADING', payload: false });
        return newCollaborator;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao cadastrar colaborador' });
        throw error;
      }
    },

    async addTool(tool) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const newTool = await addToolDB({
          name: tool.name
        });
        dispatch({ type: 'SET_LOADING', payload: false });
        return newTool;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao cadastrar ferramenta' });
        throw error;
      }
    },

    async addLoan(loan) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const newLoan = await addLoanDB({
          collaboratorId: loan.collaboratorId,
          collaboratorName: loan.collaboratorName,
          toolIds: loan.toolIds,
          toolNames: loan.toolNames,
          expectedReturnDate: loan.expectedReturnDate
        });
        dispatch({ type: 'SET_LOADING', payload: false });
        return newLoan;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao registrar empréstimo' });
        throw error;
      }
    },

    async returnTool(loanId) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await returnToolDB(loanId);
        dispatch({ type: 'RETURN_TOOL', payload: { loanId } });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao devolver ferramenta' });
        throw error;
      }
    }
  };

  const contextValue = {
    state,
    dispatch,
    actions
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      
      {/* Loading Overlay */}
      {state.loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 15px'
            }}></div>
            <p style={{ margin: 0, color: '#4a5568', fontWeight: '600' }}>
              Sincronizando dados...
            </p>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {state.error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '12px',
          fontWeight: '600',
          zIndex: 1000,
          boxShadow: '0 4px 15px rgba(245, 101, 101, 0.3)',
          cursor: 'pointer'
        }}
        onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
        >
          ❌ {state.error}
          <br />
          <small style={{ opacity: 0.9 }}>Clique para fechar</small>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
} 