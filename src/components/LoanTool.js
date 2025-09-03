import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function LoanTool() {
  const { state, dispatch, actions } = useApp();
  const [selectedCollaborator, setSelectedCollaborator] = useState('');
  const [selectedTools, setSelectedTools] = useState([]);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Todas as ferramentas estão sempre disponíveis (múltiplas unidades)
  const allTools = state.tools;

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
      actions.showModal(
        'Campo Obrigatório',
        'Por favor, selecione um colaborador antes de continuar.',
        'warning'
      );
      return;
    }
    
    if (selectedTools.length === 0) {
      actions.showModal(
        'Campo Obrigatório', 
        'Por favor, selecione pelo menos uma ferramenta antes de continuar.',
        'warning'
      );
      return;
    }
    
    if (!expectedReturnDate) {
      actions.showModal(
        'Campo Obrigatório',
        'Por favor, defina a data de devolução esperada antes de continuar.',
        'warning'
      );
      return;
    }

    setSubmitting(true);

    try {
      // Validar se o colaborador existe
      const collaborator = state.collaborators.find(c => c.id.toString() === selectedCollaborator.toString());
      if (!collaborator) {
        actions.showModal(
          'Erro de Validação',
          'Colaborador não encontrado. Tente selecionar novamente.',
          'error'
        );
        setSubmitting(false);
        return;
      }
      
      // Validar se todas as ferramentas existem
      const tools = selectedTools.map(toolId => state.tools.find(t => t.id.toString() === toolId.toString())).filter(Boolean);
      if (tools.length !== selectedTools.length) {
        actions.showModal(
          'Erro de Validação',
          'Algumas ferramentas não foram encontradas. Tente selecionar novamente.',
          'error'
        );
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
      actions.showModal(
        'Sucesso!',
        'Empréstimo registrado com sucesso! As ferramentas foram atribuídas ao colaborador.',
        'success'
      );
      
    } catch (error) {
      console.error('Erro ao registrar empréstimo:', error);
      actions.showModal(
        'Erro',
        'Erro ao registrar empréstimo. Verifique sua conexão com a internet e tente novamente.',
        'error'
      );
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
                       disabled={submitting}
                     />
                     <span style={{ 
                       fontWeight: '500'
                     }}>
                       {tool.name}
                     </span>
                     <span className="status-badge status-available" style={{ marginLeft: 'auto' }}>
                       🟢
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