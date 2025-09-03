import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AdminLogin from './AdminLogin';

function Home() {
  const { state, dispatch } = useApp();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleAdminAccess = () => {
    if (state.isAdminAuthenticated) {
      dispatch({ type: 'SET_VIEW', payload: 'admin' });
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowAdminLogin(false);
    dispatch({ type: 'SET_VIEW', payload: 'admin' });
  };

  return (
    <div className="main-container">
      {/* Título Principal */}
      <h1 className="main-title">
        🔧 Controle de Ferramentas
      </h1>
      
      <p style={{
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#718096',
        marginBottom: '40px',
        maxWidth: '600px',
        margin: '0 auto 40px'
      }}>
        Sistema profissional para gerenciamento de empréstimos de ferramentas
      </p>

      {/* Menu Principal */}
      <div className="professional-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '30px' }}>
          Menu Principal
        </h2>
        
        <div style={{
          display: 'grid',
          gap: '20px'
        }}>
          {/* Novo Empréstimo */}
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'loan' })}
            style={{
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              padding: '25px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(72, 187, 120, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 35px rgba(72, 187, 120, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(72, 187, 120, 0.3)';
            }}
          >
            <span style={{ fontSize: '2rem' }}>📋</span>
            <div>
              <div>Novo Empréstimo</div>
              <div style={{ 
                fontSize: '0.85rem', 
                opacity: 0.9, 
                fontWeight: '500',
                marginTop: '4px'
              }}>
                Registrar empréstimo de ferramentas
              </div>
            </div>
          </button>

          {/* Painel Admin */}
          <button
            onClick={handleAdminAccess}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              padding: '25px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
            }}
          >
            <span style={{ fontSize: '2rem' }}>🔐</span>
            <div>
              <div>Painel Admin</div>
              <div style={{ 
                fontSize: '0.85rem', 
                opacity: 0.9, 
                fontWeight: '500',
                marginTop: '4px'
              }}>
                Gerenciar sistema e relatórios
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Rodapé */}
      <div style={{
        textAlign: 'center',
        marginTop: '50px',
        padding: '20px',
        color: '#a0aec0',
        fontSize: '0.85rem'
      }}>
        <p style={{ margin: 0 }}>
          Sistema desenvolvido para controle profissional de ferramentas
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem' }}>
          © 2024 - Controle de Ferramentas
        </p>
      </div>

      {/* Login Admin */}
      {showAdminLogin && (
        <AdminLogin 
          onClose={() => setShowAdminLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default Home; 