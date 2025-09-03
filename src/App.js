import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Home from './components/Home';
import RegisterCollaborator from './components/RegisterCollaborator';
import RegisterTool from './components/RegisterTool';
import LoanTool from './components/LoanTool';
import AdminPanel from './components/AdminPanel';
import './App.css';

function AppContent() {
  const { state } = useApp();

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'register-collaborator':
        return <RegisterCollaborator />;
      case 'register-tool':
        return <RegisterTool />;
      case 'loan-tool':
        return <LoanTool />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
