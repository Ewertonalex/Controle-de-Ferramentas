import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function LoanTool() {
  const { state, dispatch } = useApp();
  const [selectedCollaborator, setSelectedCollaborator] = useState('');
  const [selectedTools, setSelectedTools] = useState([]);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');

  const availableTools = state.tools.filter(tool => tool.status === 'available');

  const handleToolSelection = (toolId) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter(id => id !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCollaborator && selectedTools.length > 0 && expectedReturnDate) {
      const collaborator = state.collaborators.find(c => c.id === parseInt(selectedCollaborator));
      const tools = state.tools.filter(t => selectedTools.includes(t.id));
      
      const loan = {
        id: Date.now(),
        collaboratorId: parseInt(selectedCollaborator),
        collaboratorName: collaborator.name,
        toolIds: selectedTools,
        toolNames: tools.map(t => t.name),
        loanDate: new Date().toISOString(),
        expectedReturnDate: new Date(expectedReturnDate).toISOString(),
        status: 'active',
        signature: `Assinado digitalmente por ${collaborator.name} em ${new Date().toLocaleString('pt-BR')}`
      };
      
      dispatch({ type: 'ADD_LOAN', payload: loan });
      
      alert('✅ Empréstimo registrado com sucesso!');
      dispatch({ type: 'SET_VIEW', payload: 'home' });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        📋 Novo Empréstimo de Ferramentas
      </h2>
      
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
            👤 Colaborador:
          </label>
          <select
            value={selectedCollaborator}
            onChange={(e) => setSelectedCollaborator(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '16px', 
              marginBottom: '15px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Selecione um colaborador</option>
            {state.collaborators.map(collaborator => (
              <option key={collaborator.id} value={collaborator.id}>
                {collaborator.name} - {collaborator.cpf}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
            🔧 Ferramentas:
          </label>
          <div style={{ 
            border: '2px solid #ddd', 
            padding: '15px', 
            maxHeight: '200px', 
            overflowY: 'auto',
            borderRadius: '5px',
            backgroundColor: '#f8f9fa'
          }}>
            {availableTools.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>Nenhuma ferramenta disponível</p>
            ) : (
              availableTools.map(tool => (
                <label key={tool.id} style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  padding: '5px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedTools.includes(tool.id)}
                    onChange={() => handleToolSelection(tool.id)}
                    style={{ marginRight: '10px' }}
                  />
                  {tool.name}
                </label>
              ))
            )}
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
            📅 Data Prevista de Devolução:
          </label>
          <input
            type="date"
            value={expectedReturnDate}
            onChange={(e) => setExpectedReturnDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            type="submit"
            style={{ 
              padding: '15px 30px', 
              fontSize: '18px', 
              marginRight: '15px',
              backgroundColor: selectedCollaborator && selectedTools.length > 0 && expectedReturnDate ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: selectedCollaborator && selectedTools.length > 0 && expectedReturnDate ? 'pointer' : 'not-allowed'
            }}
            disabled={!selectedCollaborator || selectedTools.length === 0 || !expectedReturnDate}
          >
            ✍️ Confirmar Empréstimo
          </button>
          <button 
            type="button"
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
            style={{ 
              padding: '15px 30px', 
              fontSize: '18px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoanTool; 