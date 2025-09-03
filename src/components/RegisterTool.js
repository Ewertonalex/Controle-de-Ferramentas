import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function RegisterTool() {
  const { dispatch } = useApp();
  const [toolName, setToolName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (toolName.trim()) {
      const tool = {
        id: Date.now(),
        name: toolName.trim(),
        status: 'available',
        createdAt: new Date().toISOString()
      };
      
      dispatch({ type: 'ADD_TOOL', payload: tool });
      setToolName('');
      alert('✅ Ferramenta cadastrada com sucesso!');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        🔧 Cadastro de Ferramentas
      </h2>
      
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#555'
          }}>
            Nome da Ferramenta:
          </label>
          <input
            type="text"
            placeholder="Ex: Furadeira, Martelo, Chave de Fenda, Alicate..."
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            required
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
              padding: '12px 30px', 
              fontSize: '16px', 
              marginRight: '15px',
              backgroundColor: '#ffc107',
              color: '#212529',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ✅ Cadastrar
          </button>
          <button 
            type="button"
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
            style={{ 
              padding: '12px 30px', 
              fontSize: '16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ⬅️ Voltar
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterTool; 