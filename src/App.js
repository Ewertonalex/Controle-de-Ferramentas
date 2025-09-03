import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Home from './components/Home';
import RegisterCollaborator from './components/RegisterCollaborator';
import RegisterTool from './components/RegisterTool';
import LoanTool from './components/LoanTool';
import AdminPanel from './components/AdminPanel';
import InstallPrompt from './components/InstallPrompt';
import './App.css';

function AppContent() {
  const { state } = useApp();

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'register-collaborator':
        return <RegisterCollaborator />;
      case 'register-tool':
        return <RegisterTool />;
      case 'loan':
        return <LoanTool />;
      case 'admin':
        return state.isAdminAuthenticated ? <AdminPanel /> : <Home />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
      <InstallPrompt />
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
