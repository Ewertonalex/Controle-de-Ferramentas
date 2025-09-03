import React from 'react';
import { useApp } from '../context/AppContext';

function Home() {
  const { state, dispatch } = useApp();

  const activeLoans = state.loans.filter(loan => loan.status === 'active');
  const overdueLoans = activeLoans.filter(loan => 
    new Date(loan.expectedReturnDate) < new Date()
  );

  return (
    <div className="main-container fade-in-up">
      <h1 className="main-title">
        🔧 Controle de Ferramentas
      </h1>
      
      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'admin' })}>
          <div className="stat-number">{state.collaborators.length}</div>
          <div className="stat-label">👥 Colaboradores</div>
          <div className="stat-hint">Clique para gerenciar</div>
        </div>
        
        <div className="stat-card" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'admin' })}>
          <div className="stat-number">{state.tools.length}</div>
          <div className="stat-label">🔧 Ferramentas</div>
          <div className="stat-hint">Clique para gerenciar</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{activeLoans.length}</div>
          <div className="stat-label">📋 Empréstimos Ativos</div>
          <div className="stat-hint">Em uso no momento</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: overdueLoans.length > 0 ? '#e53e3e' : '#48bb78' }}>
            {overdueLoans.length}
          </div>
          <div className="stat-label">⚠️ Atrasados</div>
          <div className="stat-hint">{overdueLoans.length === 0 ? 'Tudo em dia!' : 'Necessita atenção'}</div>
        </div>
      </div>

      {/* Ferramentas em Uso */}
      <div className="professional-card">
        <h2 className="section-title">Ferramentas em Uso</h2>
        
        {activeLoans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔧</div>
            <div className="empty-state-title">Nenhuma ferramenta em uso</div>
            <div className="empty-state-description">
              Todas as ferramentas estão disponíveis para empréstimo
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="professional-table">
              <thead>
                <tr>
                  <th>Colaborador</th>
                  <th>Ferramentas</th>
                  <th>Devolução</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeLoans.map(loan => {
                  const isOverdue = new Date(loan.expectedReturnDate) < new Date();
                  return (
                    <tr key={loan.id}>
                      <td style={{ fontWeight: '600' }}>{loan.collaboratorName}</td>
                      <td>{loan.toolNames.join(', ')}</td>
                      <td style={{ color: isOverdue ? '#e53e3e' : '#4a5568' }}>
                        {new Date(loan.expectedReturnDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`status-badge ${isOverdue ? 'status-borrowed' : 'status-active'}`}>
                          {isOverdue ? '🔴' : '🟢'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ações Principais */}
      <div className="professional-card">
        <h2 className="section-title">Ações Principais</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <button 
            className="btn-primary"
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'loan-tool' })}
            style={{ 
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '48px'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>📋</span>
            <span>Novo Empréstimo</span>
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'admin' })}
            style={{ 
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '48px'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>⚙️</span>
            <span>Painel Admin</span>
          </button>
        </div>
      </div>

      {/* Cadastros Rápidos */}
      <div className="professional-card">
        <h2 className="section-title">Cadastros Rápidos</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '8px'
        }}>
          <button 
            className="btn-success"
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'register-collaborator' })}
            style={{ 
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              minHeight: '60px'
            }}
          >
            <span style={{ fontSize: '1rem' }}>👤</span>
            <span style={{ fontSize: '0.75rem' }}>Colaborador</span>
          </button>
          
          <button 
            className="btn-success"
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'register-tool' })}
            style={{ 
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              minHeight: '60px'
            }}
          >
            <span style={{ fontSize: '1rem' }}>🔧</span>
            <span style={{ fontSize: '0.75rem' }}>Ferramenta</span>
          </button>
        </div>
      </div>

      {/* Alertas e Notificações */}
      {overdueLoans.length > 0 && (
        <div className="professional-card" style={{ 
          background: 'rgba(245, 101, 101, 0.1)', 
          border: '2px solid rgba(245, 101, 101, 0.2)' 
        }}>
          <h2 className="section-title" style={{ color: '#c53030' }}>
            ⚠️ Atenção: Empréstimos Atrasados
          </h2>
          <p style={{ color: '#c53030', marginBottom: '15px' }}>
            Existem {overdueLoans.length} empréstimo(s) com devolução em atraso:
          </p>
          <ul style={{ color: '#c53030', paddingLeft: '20px' }}>
            {overdueLoans.map(loan => (
              <li key={loan.id} style={{ marginBottom: '5px' }}>
                <strong>{loan.collaboratorName}</strong> - {loan.toolNames.join(', ')} 
                (venceu em {new Date(loan.expectedReturnDate).toLocaleDateString('pt-BR')})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home; 