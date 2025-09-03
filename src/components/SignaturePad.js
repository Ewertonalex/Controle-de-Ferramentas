import React, { useRef, useState, useEffect } from 'react';

const SignaturePad = ({ onSignatureChange, onClear, signatureData }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Configurar canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Configurações de desenho
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Limpar canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Se há assinatura salva, restaurar
    if (signatureData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = signatureData;
    }
  }, [signatureData]);

  const getEventPos = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if (event.touches) {
      // Touch event
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
  };

  const startDrawing = (event) => {
    event.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(event);
    setLastPoint(pos);
  };

  const draw = (event) => {
    event.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const currentPoint = getEventPos(event);

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    setLastPoint(currentPoint);
  };

  const stopDrawing = (event) => {
    event.preventDefault();
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setLastPoint(null);
    
    // Salvar assinatura como base64
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signatureDataURL = canvas.toDataURL('image/png');
    onSignatureChange(signatureDataURL);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    onClear();
  };

  const isEmpty = () => {
    const canvas = canvasRef.current;
    if (!canvas) return true;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Verificar se todos os pixels são brancos (canvas vazio)
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i] !== 255 || imageData.data[i + 1] !== 255 || imageData.data[i + 2] !== 255) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="signature-container">
      <div className="signature-header">
        <h3>✍️ Assinatura Digital</h3>
        <p>Assine abaixo para confirmar o empréstimo:</p>
      </div>
      
      <div className="signature-pad-wrapper">
        <canvas
          ref={canvasRef}
          className="signature-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        <div className="signature-overlay">
          <span className="signature-placeholder">
            {isEmpty() ? '📝 Assine aqui' : ''}
          </span>
        </div>
      </div>
      
      <div className="signature-actions">
        <button 
          type="button" 
          onClick={clearSignature}
          className="btn-clear-signature"
        >
          🗑️ Limpar
        </button>
        
        <div className="signature-info">
          <small>💡 Use o dedo no celular ou mouse no PC</small>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad; 