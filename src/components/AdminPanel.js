import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function AdminPanel() {
  const { state, dispatch, actions } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleReturnTool = async (loanId) => {
    if (window.confirm('Confirmar devolução da ferramenta?')) {
      try {
        await actions.returnTool(loanId);
        
        // Feedback visual de sucesso
        const successMessage = document.createElement('div');
        successMessage.innerHTML = '✅ Ferramenta devolvida com sucesso!';
        successMessage.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          padding: 15px 20px;
          border-radius: 12px;
          font-weight: 600;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
        `;
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
          }
        }, 3000);
        
      } catch (error) {
        console.error('Erro ao devolver ferramenta:', error);
        alert('❌ Erro ao devolver ferramenta. Verifique sua conexão.');
      }
    }
  };

  const activeLoans = state.loans.filter(loan => loan.status === 'active');
  const completedLoans = state.loans.filter(loan => loan.status === 'returned');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'collaborators':
        return (
          <div className="fade-in-up">
            <h3 className="subsection-title">
              👥 Todos os Colaboradores ({state.collaborators.length})
            </h3>
            {state.collaborators.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👤</div>
                <div className="empty-state-title">Nenhum colaborador cadastrado</div>
                <div className="empty-state-description">
                  Comece cadastrando colaboradores para usar o sistema
                </div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="professional-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>CPF</th>
                      <th>Cadastro</th>
                      <th>Total</th>
                      <th>Ativos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.collaborators.map(collaborator => {
                      const collaboratorLoans = state.loans.filter(loan => loan.collaboratorId === collaborator.id);
                      const activeCollaboratorLoans = collaboratorLoans.filter(loan => loan.status === 'active');
                      return (
                        <tr key={collaborator.id}>
                          <td style={{ fontWeight: '600' }}>
                            {collaborator.name}
                          </td>
                          <td>{collaborator.cpf}</td>
                          <td>{new Date(collaborator.createdAt).toLocaleDateString('pt-BR')}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="status-badge" style={{ backgroundColor: '#007bff', color: 'white' }}>
                              {collaboratorLoans.length}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={`status-badge ${activeCollaboratorLoans.length > 0 ? 'status-active' : 'status-returned'}`}>
                              {activeCollaboratorLoans.length}
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
        );

      case 'tools':
        return (
          <div className="fade-in-up">
            <h3 className="subsection-title">
              🔧 Todas as Ferramentas ({state.tools.length})
            </h3>
            {state.tools.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔧</div>
                <div className="empty-state-title">Nenhuma ferramenta cadastrada</div>
                <div className="empty-state-description">
                  Cadastre ferramentas para começar a controlar empréstimos
                </div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="professional-table">
                  <thead>
                    <tr>
                      <th>Ferramenta</th>
                      <th>Status</th>
                      <th>Cadastro</th>
                      <th>Total</th>
                      <th>Último Uso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.tools.map(tool => {
                      const toolLoans = state.loans.filter(loan => loan.toolIds.includes(tool.id));
                      const isCurrentlyBorrowed = state.loans.some(loan => 
                        loan.toolIds.includes(tool.id) && loan.status === 'active'
                      );
                      const lastLoan = toolLoans.sort((a, b) => new Date(b.loanDate) - new Date(a.loanDate))[0];
                      
                      return (
                        <tr key={tool.id}>
                          <td style={{ fontWeight: '600' }}>
                            {tool.name}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={`status-badge ${isCurrentlyBorrowed ? 'status-borrowed' : 'status-available'}`}>
                              {isCurrentlyBorrowed ? '🔴' : '🟢'}
                            </span>
                          </td>
                          <td>{new Date(tool.createdAt).toLocaleDateString('pt-BR')}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="status-badge" style={{ backgroundColor: '#007bff', color: 'white' }}>
                              {toolLoans.length}
                            </span>
                          </td>
                          <td>
                            {lastLoan ? (
                              <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: '600' }}>
                                  {lastLoan.collaboratorName}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#a0aec0' }}>
                                  {new Date(lastLoan.loanDate).toLocaleDateString('pt-BR')}
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: '#a0aec0', fontStyle: 'italic', fontSize: '0.7rem' }}>
                                Nunca
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="fade-in-up">
            {/* Estatísticas */}
            <div className="stats-grid">
              <div className="stat-card" onClick={() => setActiveTab('collaborators')}>
                <div className="stat-number">{state.collaborators.length}</div>
                <div className="stat-label">👥 Colaboradores</div>
                <div className="stat-hint">Clique para ver todos</div>
              </div>
              
              <div className="stat-card" onClick={() => setActiveTab('tools')}>
                <div className="stat-number">{state.tools.length}</div>
                <div className="stat-label">🔧 Ferramentas</div>
                <div className="stat-hint">Clique para ver todas</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-number">{activeLoans.length}</div>
                <div className="stat-label">📋 Empréstimos Ativos</div>
                <div className="stat-hint">Em uso no momento</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-number">{completedLoans.length}</div>
                <div className="stat-label">✅ Devoluções</div>
                <div className="stat-hint">Total devolvido</div>
              </div>
            </div>

            {/* Empréstimos Ativos */}
            <div className="professional-card">
              <h3 className="subsection-title">📋 Empréstimos Ativos</h3>
              {activeLoans.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-title">Nenhum empréstimo ativo</div>
                  <div className="empty-state-description">
                    Todas as ferramentas foram devolvidas
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
                         <th>Ação</th>
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
                             <td style={{ textAlign: 'center' }}>
                               <button
                                 onClick={() => handleReturnTool(loan.id)}
                                 className="btn-danger"
                               >
                                 🔄
                               </button>
                             </td>
                           </tr>
                         );
                       })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="main-container fade-in-up">
      <h1 className="main-title">
        ⚙️ Painel Administrativo
      </h1>
      
      {/* Navegação por Abas */}
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab('collaborators')}
          className={`tab-button ${activeTab === 'collaborators' ? 'active' : ''}`}
        >
          👥 Colaboradores
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`tab-button ${activeTab === 'tools' ? 'active' : ''}`}
        >
          🔧 Ferramentas
        </button>
      </div>

      {/* Conteúdo da Aba */}
      {renderTabContent()}

      {/* Botão Voltar */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button 
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
          className="btn-primary"
        >
          🏠 Voltar ao Início
        </button>
      </div>
    </div>
  );
}

export default AdminPanel; 