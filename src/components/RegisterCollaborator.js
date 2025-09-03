import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function RegisterCollaborator() {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && cpf.trim()) {
      const collaborator = {
        id: Date.now(),
        name: name.trim(),
        cpf: cpf.trim(),
        createdAt: new Date().toISOString()
      };
      
      dispatch({ type: 'ADD_COLLABORATOR', payload: collaborator });
      setName('');
      setCpf('');
      alert('✅ Colaborador cadastrado com sucesso!');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        👤 Cadastro de Colaboradores
      </h2>
      
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#555'
          }}>
            Nome Completo:
          </label>
          <input
            type="text"
            placeholder="Digite o nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#555'
          }}>
            CPF:
          </label>
          <input
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(formatCPF(e.target.value))}
            required
            maxLength="14"
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
              backgroundColor: '#28a745',
              color: 'white',
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

export default RegisterCollaborator; 