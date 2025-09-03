import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function RegisterTool() {
  const { dispatch, actions } = useApp();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('⚠️ Por favor, digite o nome da ferramenta');
      return;
    }

    setSubmitting(true);

    try {
      await actions.addTool({
        name: name.trim()
      });
      
      setName('');
      
      // Feedback visual de sucesso
      const successMessage = document.createElement('div');
      successMessage.innerHTML = '✅ Ferramenta cadastrada com sucesso!';
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
      console.error('Erro ao cadastrar ferramenta:', error);
      alert('❌ Erro ao cadastrar ferramenta. Verifique sua conexão com a internet.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-container fade-in-up">
      <h1 className="main-title">
        🔧 Cadastro de Ferramentas
      </h1>
      
      <div className="professional-card">
        <h2 className="section-title">Nova Ferramenta</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome da Ferramenta *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Furadeira Bosch, Martelo, Chave Inglesa..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={submitting}
            />
            <small style={{ color: '#a0aec0', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
              Digite um nome descritivo para identificar facilmente a ferramenta
            </small>
          </div>

          {/* Preview dos dados */}
          {name.trim() && (
            <div style={{
              background: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#667eea' }}>📝 Preview da Ferramenta</h4>
              <p style={{ margin: '5px 0', color: '#4a5568' }}>
                <strong>Nome:</strong> {name.trim()}
              </p>
              <p style={{ margin: '5px 0', color: '#4a5568', fontSize: '0.875rem' }}>
                <strong>Status inicial:</strong> <span className="status-badge status-available">🟢 Disponível</span>
              </p>
            </div>
          )}
          
          <div style={{ 
            display: 'grid', 
            gap: '8px'
          }}>
            <button 
              type="submit"
              className="btn-success"
              disabled={submitting || !name.trim()}
              style={{ 
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? (
                <>
                  <span className="pulse">⏳</span> Salvando...
                </>
              ) : (
                <>✅ Cadastrar</>
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

export default RegisterTool; 