import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function AdminPanel() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleReturnTool = (loanId) => {
    if (window.confirm('Confirmar devolução da ferramenta?')) {
      dispatch({ type: 'RETURN_TOOL', payload: { loanId } });
      alert('✅ Ferramenta devolvida com sucesso!');
    }
  };

  const activeLoans = state.loans.filter(loan => loan.status === 'active');
  const completedLoans = state.loans.filter(loan => loan.status === 'returned');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'collaborators':
        return (
          <div>
            <h3 style={{ color: '#555', marginBottom: '20px' }}>👥 Todos os Colaboradores ({state.collaborators.length})</h3>
            {state.collaborators.length === 0 ? (
              <p style={{ 
                padding: '40px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '10px',
                textAlign: 'center',
                fontSize: '18px'
              }}>
                Nenhum colaborador cadastrado ainda.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                      <th style={{ border: '1px solid #ddd', padding: '15px' }}>ID</th>
                      <th style={{ border: '1px solid #ddd', padding: '15px' }}>Nome</th>
                      <th style={{ border: '1px solid #ddd', padding: '15px' }}>CPF</th>
                      <th style={{ border: '1px solid #ddd', padding: '15px' }}>Data Cadastro</th>
                      <th style={{ border: '1px solid #ddd', padding: '15px' }}>Total de Empréstimos</th>
                      <th style={{ border: '1px solid #ddd', padding: '15px' }}>Empréstimos Ativos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.collaborators.map(collaborator => {
                      const collaboratorLoans = state.loans.filter(loan => loan.collaboratorId === collaborator.id);
                      const activeCollaboratorLoans = collaboratorLoans.filter(loan => loan.status === 'active');
                      return (
                        <tr key={collaborator.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
                            #{collaborator.id}
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '15px', fontWeight: 'bold' }}>
                            {collaborator.name}
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '15px' }}>
                            {collaborator.cpf}
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '15px' }}>
                            {new Date(collaborator.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
                            <span style={{ 
                              padding: '5px 10px', 
                              backgroundColor: '#007bff', 
                              color: 'white', 
                              borderRadius: '15px',
                              fontSize: '14px'
                            }}>
                              {collaboratorLoans.length}
                            </span>
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
                            <span style={{ 
                              padding: '5px 10px', 
                              backgroundColor: activeCollaboratorLoans.length > 0 ? '#28a745' : '#6c757d', 
                              color: 'white', 
                              borderRadius: '15px',
                              fontSize: '14px'
                            }}>
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
          <div>
            <h3 style={{ color: '#555', marginBottom: '20px' }}>🔧 Todas as Ferramentas ({state.tools.length})</h3>
            {state.tools.length === 0 ? (
              <p style={{ 
                padding: '40px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '10px',
                textAlign: 'center',
                fontSize: '18px'
              }}>
                Nenhuma ferramenta cadastrada ainda.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#ffc107', color: '#212529' }}>
                      <th style={{ border: '1px solid #ddd', padding: '15px' }}>ID</th>
                      <th style={{ border: '1px solid #ddd', padding: '15px' }}>Nome da Ferramenta</th>
                      <th style={{ border: '1px solid #ddd', padding: '15px' }}>Status Atual</th>
                      <th style={{ border: '1px solid #ddd', padding: '15px' }}>Data Cadastro</th>
                      <th style={{ border: '1px solid #ddd', padding: '15px' }}>Total de Empréstimos</th>
                      <th style={{ border: '1px solid #ddd', padding: '15px' }}>Último Empréstimo</th>
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
                        <tr key={tool.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
                            #{tool.id}
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '15px', fontWeight: 'bold' }}>
                            {tool.name}
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
                            <span style={{ 
                              padding: '6px 15px', 
                              borderRadius: '20px', 
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              backgroundColor: isCurrentlyBorrowed ? '#dc3545' : '#28a745' 
                            }}>
                              {isCurrentlyBorrowed ? '🔴 Emprestada' : '🟢 Disponível'}
                            </span>
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '15px' }}>
                            {new Date(tool.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
                            <span style={{ 
                              padding: '5px 10px', 
                              backgroundColor: '#007bff', 
                              color: 'white', 
                              borderRadius: '15px',
                              fontSize: '14px'
                            }}>
                              {toolLoans.length}
                            </span>
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '15px' }}>
                            {lastLoan ? (
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  {lastLoan.collaboratorName}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                  {new Date(lastLoan.loanDate).toLocaleDateString('pt-BR')}
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: '#999' }}>Nunca emprestada</span>
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
          <div>
            {/* Estatísticas */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px', 
              marginBottom: '40px' 
            }}>
              <div style={{ 
                border: '1px solid #ddd', 
                padding: '20px', 
                borderRadius: '10px',
                textAlign: 'center',
                backgroundColor: '#e7f3ff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('collaborators')}>
                <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>👥 Colaboradores</h4>
                <p style={{ fontSize: '32px', margin: '0', fontWeight: 'bold', color: '#007bff' }}>
                  {state.collaborators.length}
                </p>
                <small style={{ color: '#666' }}>Clique para ver todos</small>
              </div>
              <div style={{ 
                border: '1px solid #ddd', 
                padding: '20px', 
                borderRadius: '10px',
                textAlign: 'center',
                backgroundColor: '#fff3cd',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('tools')}>
                <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>🔧 Ferramentas</h4>
                <p style={{ fontSize: '32px', margin: '0', fontWeight: 'bold', color: '#856404' }}>
                  {state.tools.length}
                </p>
                <small style={{ color: '#666' }}>Clique para ver todas</small>
              </div>
              <div style={{ 
                border: '1px solid #ddd', 
                padding: '20px', 
                borderRadius: '10px',
                textAlign: 'center',
                backgroundColor: '#d4edda',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>📋 Empréstimos Ativos</h4>
                <p style={{ fontSize: '32px', margin: '0', fontWeight: 'bold', color: '#155724' }}>
                  {activeLoans.length}
                </p>
              </div>
              <div style={{ 
                border: '1px solid #ddd', 
                padding: '20px', 
                borderRadius: '10px',
                textAlign: 'center',
                backgroundColor: '#f8d7da',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#721c24' }}>✅ Devoluções</h4>
                <p style={{ fontSize: '32px', margin: '0', fontWeight: 'bold', color: '#721c24' }}>
                  {completedLoans.length}
                </p>
              </div>
            </div>

            {/* Empréstimos Ativos */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ color: '#555', marginBottom: '15px' }}>📋 Empréstimos Ativos</h3>
              {activeLoans.length === 0 ? (
                <p style={{ 
                  padding: '20px', 
                  backgroundColor: '#f8f9fa', 
                  border: '1px solid #dee2e6', 
                  borderRadius: '5px',
                  textAlign: 'center'
                }}>
                  Nenhum empréstimo ativo no momento.
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#28a745', color: 'white' }}>
                        <th style={{ border: '1px solid #ddd', padding: '12px' }}>Colaborador</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px' }}>Ferramentas</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px' }}>Data Empréstimo</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px' }}>Data Prevista</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px' }}>Ações</th>
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
                          <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                            <button
                              onClick={() => handleReturnTool(loan.id)}
                              style={{ 
                                padding: '8px 12px', 
                                fontSize: '12px', 
                                backgroundColor: '#dc3545', 
                                color: 'white', 
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer'
                              }}
                            >
                              🔄 Devolver
                            </button>
                          </td>
                        </tr>
                      ))}
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
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        ⚙️ Painel Administrativo
      </h2>
      
      {/* Navegação por Abas */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '30px', 
        borderBottom: '2px solid #dee2e6',
        gap: '10px'
      }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: activeTab === 'dashboard' ? '#007bff' : 'transparent',
            color: activeTab === 'dashboard' ? 'white' : '#007bff',
            border: 'none',
            borderRadius: '5px 5px 0 0',
            cursor: 'pointer',
            borderBottom: activeTab === 'dashboard' ? '2px solid #007bff' : 'none'
          }}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab('collaborators')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: activeTab === 'collaborators' ? '#17a2b8' : 'transparent',
            color: activeTab === 'collaborators' ? 'white' : '#17a2b8',
            border: 'none',
            borderRadius: '5px 5px 0 0',
            cursor: 'pointer',
            borderBottom: activeTab === 'collaborators' ? '2px solid #17a2b8' : 'none'
          }}
        >
          👥 Colaboradores
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: activeTab === 'tools' ? '#ffc107' : 'transparent',
            color: activeTab === 'tools' ? '#212529' : '#ffc107',
            border: 'none',
            borderRadius: '5px 5px 0 0',
            cursor: 'pointer',
            borderBottom: activeTab === 'tools' ? '2px solid #ffc107' : 'none'
          }}
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
          style={{ 
            padding: '15px 30px', 
            fontSize: '18px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🏠 Voltar ao Início
        </button>
      </div>
    </div>
  );
}

export default AdminPanel; 