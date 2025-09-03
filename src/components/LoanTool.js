import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function LoanTool() {
  const { state, dispatch, actions } = useApp();
  const [selectedCollaborator, setSelectedCollaborator] = useState('');
  const [selectedTools, setSelectedTools] = useState([]);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Mostrar todas as ferramentas, com indicação de status
  const allTools = state.tools.map(tool => {
    const isCurrentlyBorrowed = state.loans.some(loan => 
      loan.toolIds && loan.toolIds.some(id => id.toString() === tool.id.toString()) && loan.status === 'active'
    );
    return { ...tool, isCurrentlyBorrowed };
  });

  const handleToolSelection = (toolId) => {
    setSelectedTools(prev => 
      prev.some(id => id.toString() === toolId.toString())
        ? prev.filter(id => id.toString() !== toolId.toString())
        : [...prev, toolId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCollaborator) {
      alert('⚠️ Por favor, selecione um colaborador');
      return;
    }
    
    if (selectedTools.length === 0) {
      alert('⚠️ Por favor, selecione pelo menos uma ferramenta');
      return;
    }
    
    if (!expectedReturnDate) {
      alert('⚠️ Por favor, defina a data de devolução esperada');
      return;
    }

    setSubmitting(true);

    try {
      // Validar se o colaborador existe
      const collaborator = state.collaborators.find(c => c.id.toString() === selectedCollaborator.toString());
      if (!collaborator) {
        alert('❌ Colaborador não encontrado. Tente selecionar novamente.');
        setSubmitting(false);
        return;
      }
      
      // Validar se todas as ferramentas existem
      const tools = selectedTools.map(toolId => state.tools.find(t => t.id.toString() === toolId.toString())).filter(Boolean);
      if (tools.length !== selectedTools.length) {
        alert('❌ Algumas ferramentas não foram encontradas. Tente selecionar novamente.');
        setSubmitting(false);
        return;
      }
      
      await actions.addLoan({
        collaboratorId: collaborator.id,
        collaboratorName: collaborator.name,
        toolIds: selectedTools,
        toolNames: tools.map(tool => tool.name),
        expectedReturnDate: expectedReturnDate
      });
      
      // Reset form
      setSelectedCollaborator('');
      setSelectedTools([]);
      setExpectedReturnDate('');
      
      // Feedback visual de sucesso
      const successMessage = document.createElement('div');
      successMessage.innerHTML = '✅ Empréstimo registrado com sucesso!';
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
      console.error('Erro ao registrar empréstimo:', error);
      alert('❌ Erro ao registrar empréstimo. Verifique sua conexão com a internet.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCollaboratorData = state.collaborators.find(c => c.id.toString() === selectedCollaborator.toString());
  const selectedToolsData = selectedTools.map(toolId => state.tools.find(t => t.id.toString() === toolId.toString())).filter(Boolean);

  return (
    <div className="main-container fade-in-up">
      <h1 className="main-title">
        📋 Registro de Empréstimo
      </h1>
      
      <div className="professional-card">
        <h2 className="section-title">Novo Empréstimo</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Seleção de Colaborador */}
          <div className="form-group">
            <label className="form-label">Colaborador *</label>
            {state.collaborators.length === 0 ? (
              <div style={{
                background: 'rgba(245, 101, 101, 0.1)',
                border: '1px solid rgba(245, 101, 101, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <p style={{ margin: '0 0 15px 0', color: '#c53030' }}>
                  ⚠️ Nenhum colaborador cadastrado
                </p>
                <button 
                  type="button"
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'register-collaborator' })}
                  className="btn-success"
                >
                  👤 Cadastrar Primeiro Colaborador
                </button>
              </div>
            ) : (
              <select
                className="form-select"
                value={selectedCollaborator}
                onChange={(e) => setSelectedCollaborator(e.target.value)}
                required
                disabled={submitting}
              >
                <option value="">Selecione um colaborador...</option>
                {state.collaborators.map(collaborator => (
                  <option key={collaborator.id} value={collaborator.id}>
                    {collaborator.name} - {collaborator.cpf}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Seleção de Ferramentas */}
          <div className="form-group">
            <label className="form-label">Selecionar Ferramentas *</label>
            {allTools.length === 0 ? (
              <div style={{
                background: 'rgba(245, 101, 101, 0.1)',
                border: '1px solid rgba(245, 101, 101, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                                 <p style={{ margin: '0 0 15px 0', color: '#c53030' }}>
                   ⚠️ Nenhuma ferramenta cadastrada
                 </p>
                <button 
                  type="button"
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'register-tool' })}
                  className="btn-success"
                >
                  🔧 Cadastrar Primeira Ferramenta
                </button>
              </div>
            ) : (
                             <div style={{
                 background: 'rgba(255, 255, 255, 0.9)',
                 border: '2px solid #e2e8f0',
                 borderRadius: '12px',
                 padding: '20px',
                 maxHeight: '300px',
                 overflowY: 'auto'
               }}>
                 <p style={{ margin: '0 0 15px 0', color: '#4a5568', fontSize: '0.875rem' }}>
                   Selecione uma ou mais ferramentas:
                 </p>
                 {allTools.map(tool => (
                   <label key={tool.id} className="custom-checkbox">
                     <input
                       type="checkbox"
                       checked={selectedTools.some(id => id.toString() === tool.id.toString())}
                       onChange={() => handleToolSelection(tool.id)}
                       disabled={submitting || tool.isCurrentlyBorrowed}
                     />
                     <span style={{ 
                       fontWeight: '500',
                       opacity: tool.isCurrentlyBorrowed ? 0.6 : 1,
                       textDecoration: tool.isCurrentlyBorrowed ? 'line-through' : 'none'
                     }}>
                       {tool.name}
                     </span>
                     <span className={`status-badge ${tool.isCurrentlyBorrowed ? 'status-borrowed' : 'status-available'}`} style={{ marginLeft: 'auto' }}>
                       {tool.isCurrentlyBorrowed ? '🔴' : '🟢'}
                     </span>
                   </label>
                 ))}
               </div>
            )}
          </div>

          {/* Data de Devolução */}
          <div className="form-group">
            <label className="form-label">Data de Devolução Esperada *</label>
            <input
              type="date"
              className="form-input"
              value={expectedReturnDate}
              onChange={(e) => setExpectedReturnDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              disabled={submitting}
            />
            <small style={{ color: '#a0aec0', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
              Data limite para devolução das ferramentas
            </small>
          </div>

          {/* Preview do Empréstimo */}
          {(selectedCollaboratorData || selectedToolsData.length > 0 || expectedReturnDate) && (
            <div style={{
              background: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#667eea' }}>📝 Resumo do Empréstimo</h4>
              
              {selectedCollaboratorData && (
                <p style={{ margin: '5px 0', color: '#4a5568' }}>
                  <strong>👤 Colaborador:</strong> {selectedCollaboratorData.name}
                </p>
              )}
              
              {selectedToolsData.length > 0 && (
                <p style={{ margin: '5px 0', color: '#4a5568' }}>
                  <strong>🔧 Ferramentas ({selectedToolsData.length}):</strong> {selectedToolsData.map(tool => tool.name).join(', ')}
                </p>
              )}
              
              {expectedReturnDate && (
                <p style={{ margin: '5px 0', color: '#4a5568' }}>
                  <strong>📅 Devolução esperada:</strong> {new Date(expectedReturnDate).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          )}
          
                     <div style={{ 
             display: 'grid', 
             gap: '8px'
           }}>
             <button 
               type="submit"
               className="btn-primary"
               disabled={submitting || !selectedCollaborator || selectedTools.length === 0 || !expectedReturnDate}
               style={{ 
                 opacity: submitting ? 0.7 : 1,
                 cursor: submitting ? 'not-allowed' : 'pointer'
               }}
             >
               {submitting ? (
                 <>
                   <span className="pulse">⏳</span> Registrando...
                 </>
               ) : (
                 <>📋 Registrar</>
               )}
             </button>
             
             <button 
               type="button"
               onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
               className="btn-secondary"
               disabled={submitting}
             >
               ⬅️ Voltar
             </button>
           </div>
        </form>
      </div>


    </div>
  );
}

export default LoanTool; 