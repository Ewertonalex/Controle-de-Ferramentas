import React from 'react';

function Modal({ isOpen, onClose, title, message, type = 'info', onConfirm, confirmText = 'Confirmar', cancelText = 'Cancelar' }) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
          iconBg: 'rgba(72, 187, 120, 0.1)'
        };
      case 'error':
        return {
          icon: '❌',
          gradient: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
          iconBg: 'rgba(245, 101, 101, 0.1)'
        };
      case 'warning':
        return {
          icon: '⚠️',
          gradient: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
          iconBg: 'rgba(237, 137, 54, 0.1)'
        };
      case 'confirm':
        return {
          icon: '🤔',
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          iconBg: 'rgba(102, 126, 234, 0.1)'
        };
      default:
        return {
          icon: 'ℹ️',
          gradient: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
          iconBg: 'rgba(66, 153, 225, 0.1)'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(8px)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        animation: 'modalSlideIn 0.3s ease-out'
      }}>
        {/* Ícone e Título */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: styles.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            marginRight: '15px'
          }}>
            {styles.icon}
          </div>
          <h3 style={{
            margin: 0,
            fontSize: '1.4rem',
            fontWeight: '700',
            background: styles.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {title}
          </h3>
        </div>

        {/* Mensagem */}
        <div style={{
          marginBottom: '25px',
          fontSize: '1rem',
          lineHeight: '1.5',
          color: '#4a5568'
        }}>
          {message}
        </div>

        {/* Botões */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              style={{
                background: styles.gradient,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                minWidth: '100px'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {confirmText}
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(74, 85, 104, 0.1)',
              color: '#4a5568',
              border: '1px solid rgba(74, 85, 104, 0.2)',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '100px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(74, 85, 104, 0.15)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(74, 85, 104, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {onConfirm ? cancelText : 'Fechar'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default Modal; 