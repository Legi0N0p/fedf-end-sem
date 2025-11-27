import React, { useState } from 'react';
import DashboardSummary from './components/DashboardSummary';
import AccountList from './components/AccountList';
import AddTransaction from './components/AddTransaction';
import TransactionHistory from './components/TransactionHistory';
import ValidateBalances from './components/ValidateBalances';
import './App.css';

function App() {
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTransactionAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleSelectAccount = (accountId) => {
    setSelectedAccountId(accountId);
    setActiveTab('transactions');
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🏦 Online Banking Dashboard</h1>
          <p>Manage your accounts and transactions</p>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-item ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          Accounts
        </button>
        <button
          className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Add Transaction
        </button>
        <button
          className={`nav-item ${activeTab === 'validation' ? 'active' : ''}`}
          onClick={() => setActiveTab('validation')}
        >
          Validate Balances
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <DashboardSummary refreshTrigger={refreshKey} />
            <TransactionHistory accountId={selectedAccountId} refreshTrigger={refreshKey} />
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="tab-content">
            <AccountList onSelectAccount={handleSelectAccount} refreshTrigger={refreshKey} />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="tab-content">
            <AddTransaction
              accountId={selectedAccountId}
              onTransactionAdded={handleTransactionAdded}
            />
            <TransactionHistory accountId={selectedAccountId} refreshTrigger={refreshKey} />
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="tab-content">
            <ValidateBalances refreshTrigger={refreshKey} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Online Banking Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
