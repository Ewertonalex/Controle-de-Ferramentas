import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function RegisterCollaborator() {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const validateCPF = (cpf) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('⚠️ Por favor, digite o nome do colaborador');
      return;
    }
    
    if (!validateCPF(cpf)) {
      alert('⚠️ Por favor, digite um CPF válido com 11 dígitos');
      return;
    }

    setLoading(true);

    // Simular delay de processamento para melhor UX
    setTimeout(() => {
      const collaborator = {
        id: Date.now(),
        name: name.trim(),
        cpf: cpf.trim(),
        createdAt: new Date().toISOString()
      };
      
      dispatch({ type: 'ADD_COLLABORATOR', payload: collaborator });
      setName('');
      setCpf('');
      setLoading(false);
      
      // Feedback visual de sucesso
      const successMessage = document.createElement('div');
      successMessage.innerHTML = '✅ Colaborador cadastrado com sucesso!';
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
        document.body.removeChild(successMessage);
      }, 3000);
    }, 800);
  };

  return (
    <div className="main-container fade-in-up">
      <h1 className="main-title">
        👤 Cadastro de Colaboradores
      </h1>
      
      <div className="professional-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 className="section-title">Novo Colaborador</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome Completo *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Digite o nome completo do colaborador"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">CPF *</label>
            <input
              type="text"
              className="form-input"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              required
              maxLength="14"
              disabled={loading}
            />
            <small style={{ color: '#a0aec0', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
              Digite apenas os números do CPF
            </small>
          </div>

          {/* Preview dos dados */}
          {(name.trim() || cpf.trim()) && (
            <div style={{
              background: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#667eea' }}>📝 Preview dos Dados</h4>
              {name.trim() && (
                <p style={{ margin: '5px 0', color: '#4a5568' }}>
                  <strong>Nome:</strong> {name.trim()}
                </p>
              )}
              {cpf.trim() && (
                <p style={{ margin: '5px 0', color: '#4a5568' }}>
                  <strong>CPF:</strong> {cpf.trim()}
                </p>
              )}
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              type="submit"
              className="btn-success"
              disabled={loading || !name.trim() || !validateCPF(cpf)}
              style={{ 
                minWidth: '180px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <span className="pulse">⏳</span> Cadastrando...
                </>
              ) : (
                <>✅ Cadastrar Colaborador</>
              )}
            </button>
            
            <button 
              type="button"
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
              className="btn-secondary"
              disabled={loading}
              style={{ minWidth: '140px' }}
            >
              ⬅️ Voltar
            </button>
          </div>
        </form>
      </div>

      {/* Dicas e informações */}
      <div className="professional-card" style={{ maxWidth: '600px', margin: '30px auto 0' }}>
        <h3 className="subsection-title">💡 Dicas Importantes</h3>
        <ul style={{ color: '#4a5568', lineHeight: '1.6' }}>
          <li>O <strong>nome completo</strong> será usado para identificar o colaborador nos empréstimos</li>
          <li>O <strong>CPF</strong> deve conter exatamente 11 dígitos numéricos</li>
          <li>Todos os dados ficam salvos localmente no navegador</li>
          <li>Você pode cadastrar quantos colaboradores precisar</li>
        </ul>
      </div>
    </div>
  );
}

export default RegisterCollaborator; 