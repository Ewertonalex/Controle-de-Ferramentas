import React from 'react';
import { useApp } from '../context/AppContext';

function Home() {
  const { state, dispatch } = useApp();

  const activeLoans = state.loans.filter(loan => loan.status === 'active');

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        🔧 Controle de Ferramentas
      </h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#555' }}>Ferramentas em Uso ({activeLoans.length})</h2>
        {activeLoans.length === 0 ? (
          <p style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            Nenhuma ferramenta em uso no momento.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ border: '1px solid #ddd', padding: '12px' }}>Colaborador</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px' }}>Ferramenta(s)</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px' }}>Data Empréstimo</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px' }}>Data Prevista</th>
                </tr>
              </thead>
              <tbody>
                {activeLoans.map(loan => (
                  <tr key={loan.id}>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>{loan.collaboratorName}</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>{loan.toolNames.join(', ')}</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                      {new Date(loan.loanDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                      {new Date(loan.expectedReturnDate).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <button 
          style={{ 
            marginRight: '15px', 
            padding: '15px 30px', 
            fontSize: '18px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'loan-tool' })}
        >
          📋 Iniciar Novo Empréstimo
        </button>
        <button 
          style={{ 
            padding: '15px 30px', 
            fontSize: '18px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'admin' })}
        >
          ⚙️ Painel Administrativo
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '5px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: '0', color: '#555' }}>Cadastros Rápidos</h3>
        <button 
          style={{ 
            marginRight: '15px', 
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'register-collaborator' })}
        >
          👤 Cadastrar Colaborador
        </button>
        <button 
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#ffc107',
            color: '#212529',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'register-tool' })}
        >
          🔧 Cadastrar Ferramenta
        </button>
      </div>
    </div>
  );
}

export default Home; 