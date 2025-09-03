#!/bin/bash

echo "🔧 Iniciando o Controle de Ferramentas..."
echo ""

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"
echo ""

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install --legacy-peer-deps
    echo ""
fi

echo "🚀 Iniciando o aplicativo..."
echo ""
echo "📱 Acesse: http://localhost:3000"
echo "📋 Para instalar no celular, abra no navegador e toque em 'Adicionar à tela inicial'"
echo ""

# Iniciar o aplicativo
npm start 