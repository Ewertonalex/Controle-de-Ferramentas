import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function AdminPanel() {
  const { state, dispatch, actions } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingCollaborator, setEditingCollaborator] = useState(null);
  const [editingTool, setEditingTool] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCpf, setEditCpf] = useState('');



  const handleEditCollaborator = (collaborator) => {
    setEditingCollaborator(collaborator.id);
    setEditName(collaborator.name);
    setEditCpf(collaborator.cpf);
  };

  const handleSaveCollaborator = async () => {
    try {
      await actions.updateCollaborator(editingCollaborator, {
        name: editName.trim(),
        cpf: editCpf.trim()
      });
      setEditingCollaborator(null);
      setEditName('');
      setEditCpf('');
      
      actions.showModal(
        'Sucesso!',
        'Colaborador atualizado com sucesso!',
        'success'
      );
    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error);
      actions.showModal(
        'Erro',
        'Erro ao atualizar colaborador. Tente novamente.',
        'error'
      );
    }
  };

  const handleDeleteCollaborator = async (collaborator) => {
    const hasActiveLoans = state.loans.some(loan => 
      loan.collaboratorId.toString() === collaborator.id.toString() && loan.status === 'active'
    );
    
    if (hasActiveLoans) {
      actions.showModal(
        'Operação Não Permitida',
        'Não é possível excluir colaborador com empréstimos ativos. Primeiro finalize todos os empréstimos deste colaborador.',
        'warning'
      );
      return;
    }
    
    actions.showModal(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o colaborador "${collaborator.name}"?\n\nEsta ação não pode ser desfeita.`,
      'confirm',
      async () => {
        try {
          await actions.deleteCollaborator(collaborator.id);
          actions.showModal(
            'Sucesso!',
            'Colaborador excluído com sucesso!',
            'success'
          );
        } catch (error) {
          console.error('Erro ao excluir colaborador:', error);
          actions.showModal(
            'Erro',
            'Erro ao excluir colaborador. Tente novamente.',
            'error'
          );
        }
      }
    );
  };

  const handleEditTool = (tool) => {
    setEditingTool(tool.id);
    setEditName(tool.name);
  };

  const handleSaveTool = async () => {
    try {
      await actions.updateTool(editingTool, {
        name: editName.trim()
      });
      setEditingTool(null);
      setEditName('');
      
      actions.showModal(
        'Sucesso!',
        'Ferramenta atualizada com sucesso!',
        'success'
      );
    } catch (error) {
      console.error('Erro ao atualizar ferramenta:', error);
      actions.showModal(
        'Erro',
        'Erro ao atualizar ferramenta. Tente novamente.',
        'error'
      );
    }
  };

  const handleDeleteTool = async (tool) => {
    actions.showModal(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a ferramenta "${tool.name}"?\n\nAtenção: Isso irá remover a ferramenta permanentemente, mas não afetará empréstimos já registrados.`,
      'confirm',
      async () => {
        try {
          await actions.deleteTool(tool.id);
          actions.showModal(
            'Sucesso!',
            'Ferramenta excluída com sucesso!',
            'success'
          );
        } catch (error) {
          console.error('Erro ao excluir ferramenta:', error);
          actions.showModal(
            'Erro',
            'Erro ao excluir ferramenta. Tente novamente.',
            'error'
          );
        }
      }
    );
  };

  const handleReturnTool = async (loanId) => {
    const loan = state.loans.find(l => l.id === loanId);
    if (!loan) return;
    
    actions.showModal(
      'Confirmar Devolução',
      `Confirmar a devolução das ferramentas?\n\nColaborador: ${loan.collaboratorName}\nFerramentas: ${loan.toolNames.join(', ')}\n\nAs ferramentas ficarão disponíveis novamente.`,
      'confirm',
      async () => {
        try {
          await actions.returnTool(loanId);
          actions.showModal(
            'Sucesso!',
            'Ferramentas devolvidas com sucesso!',
            'success'
          );
        } catch (error) {
          console.error('Erro ao devolver ferramenta:', error);
          actions.showModal(
            'Erro',
            'Erro ao devolver ferramentas. Tente novamente.',
            'error'
          );
        }
      }
    );
  };

  const handleDeleteLoan = async (loan) => {
    actions.showModal(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir este empréstimo atrasado?\n\nColaborador: ${loan.collaboratorName}\nFerramentas: ${loan.toolNames.join(', ')}\n\nEsta ação não pode ser desfeita.`,
      'confirm',
      async () => {
        try {
          await actions.deleteLoan(loan.id);
          actions.showModal(
            'Sucesso!',
            'Empréstimo excluído com sucesso!',
            'success'
          );
        } catch (error) {
          console.error('Erro ao excluir empréstimo:', error);
          actions.showModal(
            'Erro',
            'Erro ao excluir empréstimo. Tente novamente.',
            'error'
          );
        }
      }
    );
  };

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const activeLoans = state.loans.filter(loan => loan.status === 'active');
  const completedLoans = state.loans.filter(loan => loan.status === 'returned');
  
  // Comparar apenas as datas (sem hora) para evitar problemas de timezone
  const today = new Date().toISOString().split('T')[0];
  const overdueLoans = activeLoans.filter(loan => {
    const loanDate = loan.expectedReturnDate.split('T')[0]; // Pegar apenas a parte da data
    return loanDate < today;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="fade-in-up">
            <h3 className="subsection-title">📊 Relatório Geral</h3>
            
            {/* Cards de Estatísticas */}
            <div className="stats-grid" style={{ marginBottom: '30px' }}>
              <div className="stat-card">
                <div className="stat-number">{state.collaborators.length}</div>
                <div className="stat-label">👥 Colaboradores</div>
                <div className="stat-hint">Cadastrados no sistema</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-number">{state.tools.length}</div>
                <div className="stat-label">🔧 Ferramentas</div>
                <div className="stat-hint">Disponíveis para empréstimo</div>
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

            {/* Alertas de Empréstimos Atrasados */}
            {overdueLoans.length > 0 && (
              <div className="professional-card" style={{ 
                background: 'rgba(245, 101, 101, 0.1)', 
                border: '2px solid rgba(245, 101, 101, 0.2)',
                marginBottom: '30px'
              }}>
                <h3 className="subsection-title" style={{ color: '#c53030' }}>
                  ⚠️ Atenção: Empréstimos Atrasados
                </h3>
                <p style={{ color: '#c53030', marginBottom: '15px', fontSize: '0.9rem' }}>
                  Existem {overdueLoans.length} empréstimo(s) com devolução em atraso:
                </p>
                <ul style={{ color: '#c53030', paddingLeft: '20px', fontSize: '0.85rem' }}>
                  {overdueLoans.map(loan => (
                    <li key={loan.id} style={{ marginBottom: '5px' }}>
                      <strong>{loan.collaboratorName}</strong> - {loan.toolNames.join(', ')} 
                      (venceu em {new Date(loan.expectedReturnDate + 'T00:00:00').toLocaleDateString('pt-BR')})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ferramentas em Uso */}
            <div className="professional-card">
              <h3 className="subsection-title">🔧 Ferramentas em Uso Atual</h3>
              
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
                        <th>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeLoans.map(loan => {
                        // Comparar apenas datas (sem hora) para evitar problemas de timezone
                        const loanDate = loan.expectedReturnDate.split('T')[0];
                        const isOverdue = loanDate < today;
                        return (
                          <tr key={loan.id}>
                            <td style={{ fontWeight: '600' }}>{loan.collaboratorName}</td>
                            <td>{loan.toolNames.join(', ')}</td>
                            <td style={{ color: isOverdue ? '#e53e3e' : '#4a5568' }}>
                              {new Date(loan.expectedReturnDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`status-badge ${isOverdue ? 'status-borrowed' : 'status-active'}`}>
                                {isOverdue ? '🔴' : '🟢'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                <button
                                  onClick={() => handleReturnTool(loan.id)}
                                  className="btn-success"
                                  style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                                  title="Devolver ferramentas"
                                >
                                  🔄
                                </button>
                                {isOverdue && (
                                  <button
                                    onClick={() => handleDeleteLoan(loan)}
                                    className="btn-danger"
                                    style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                                    title="Excluir empréstimo atrasado"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
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

      case 'collaborators':
        return (
          <div className="fade-in-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="subsection-title" style={{ margin: 0 }}>
                👥 Todos os Colaboradores ({state.collaborators.length})
              </h3>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'register-collaborator' })}
                className="btn-success"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                ➕ Novo Colaborador
              </button>
            </div>
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
                      <th>Total</th>
                      <th>Ativos</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.collaborators.map(collaborator => {
                      const collaboratorLoans = state.loans.filter(loan => loan.collaboratorId.toString() === collaborator.id.toString());
                      const activeCollaboratorLoans = collaboratorLoans.filter(loan => loan.status === 'active');
                      const isEditing = editingCollaborator === collaborator.id;
                      
                      return (
                        <tr key={collaborator.id}>
                          <td style={{ fontWeight: '600' }}>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '4px 6px',
                                  border: '1px solid #667eea',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem'
                                }}
                              />
                            ) : (
                              collaborator.name
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editCpf}
                                onChange={(e) => setEditCpf(formatCPF(e.target.value))}
                                maxLength="14"
                                style={{
                                  width: '100%',
                                  padding: '4px 6px',
                                  border: '1px solid #667eea',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem'
                                }}
                              />
                            ) : (
                              collaborator.cpf
                            )}
                          </td>
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
                          <td style={{ textAlign: 'center' }}>
                            {isEditing ? (
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                <button
                                  onClick={handleSaveCollaborator}
                                  className="btn-success"
                                  style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                                  disabled={!editName.trim() || !editCpf.trim()}
                                >
                                  ✅
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCollaborator(null);
                                    setEditName('');
                                    setEditCpf('');
                                  }}
                                  className="btn-secondary"
                                  style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                                >
                                  ❌
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                <button
                                  onClick={() => handleEditCollaborator(collaborator)}
                                  className="btn-secondary"
                                  style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteCollaborator(collaborator)}
                                  className="btn-danger"
                                  style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                                  disabled={activeCollaboratorLoans.length > 0}
                                >
                                  🗑️
                                </button>
                              </div>
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

      case 'tools':
        return (
          <div className="fade-in-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="subsection-title" style={{ margin: 0 }}>
                🔧 Todas as Ferramentas ({state.tools.length})
              </h3>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'register-tool' })}
                className="btn-success"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                ➕ Nova Ferramenta
              </button>
            </div>
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
                      <th>Total Usos</th>
                      <th>Último Uso</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.tools.map(tool => {
                      const toolLoans = state.loans.filter(loan => 
                        loan.toolIds && loan.toolIds.some(id => id.toString() === tool.id.toString())
                      );
                      const lastLoan = toolLoans.sort((a, b) => new Date(b.loanDate) - new Date(a.loanDate))[0];
                      const isEditing = editingTool === tool.id;
                      
                      return (
                        <tr key={tool.id}>
                          <td style={{ fontWeight: '600' }}>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '4px 6px',
                                  border: '1px solid #667eea',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem'
                                }}
                              />
                            ) : (
                              tool.name
                            )}
                          </td>
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
                          <td style={{ textAlign: 'center' }}>
                            {isEditing ? (
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                <button
                                  onClick={handleSaveTool}
                                  className="btn-success"
                                  style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                                  disabled={!editName.trim()}
                                >
                                  ✅
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingTool(null);
                                    setEditName('');
                                  }}
                                  className="btn-secondary"
                                  style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                                >
                                  ❌
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                <button
                                  onClick={() => handleEditTool(tool)}
                                  className="btn-secondary"
                                  style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteTool(tool)}
                                  className="btn-danger"
                                  style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                                >
                                  🗑️
                                </button>
                              </div>
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
                         <th>Assinatura</th>
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
                               {loan.signature ? (
                                 <button
                                   onClick={() => window.open(loan.signature, '_blank')}
                                   className="btn-secondary"
                                   style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                                   title="Ver assinatura digital"
                                 >
                                   ✍️
                                 </button>
                               ) : (
                                 <span style={{ color: '#a0aec0', fontSize: '0.7rem' }}>-</span>
                               )}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="main-title" style={{ margin: 0 }}>
          ⚙️ Painel Administrativo
        </h1>
        <button
          onClick={() => {
            actions.logoutAdmin();
            dispatch({ type: 'SET_VIEW', payload: 'home' });
          }}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          🚪 Sair
        </button>
      </div>
      
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

      {/* Rodapé */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        padding: '20px',
        color: '#a0aec0',
        fontSize: '0.8rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{ margin: '0 0 5px 0' }}>
          © 2025 - Controle de Ferramentas
        </p>
        <p style={{ margin: 0 }}>
          Criado por{' '}
          <a 
            href="https://www.linkedin.com/in/ewertonalexander/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#5a67d8'}
            onMouseLeave={(e) => e.target.style.color = '#667eea'}
          >
            Ewerton Alexander
          </a>
        </p>
      </div>
    </div>
  );
}

export default AdminPanel; 