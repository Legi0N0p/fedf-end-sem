import React, { useState, useEffect } from 'react';
import { getAccounts, deleteAccount } from '../api';
import './AccountList.css';

function AccountList({ onSelectAccount, refreshTrigger }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, [refreshTrigger]);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAccounts();
      setAccounts(response.data.data);
    } catch (err) {
      setError('Failed to fetch accounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteAccount(accountId);
        fetchAccounts();
      } catch (err) {
        setError('Failed to delete account');
        console.error(err);
      }
    }
  };

  return (
    <div className="account-list">
      <h2>Your Accounts</h2>
      {loading && <p className="loading">Loading accounts...</p>}
      {error && <p className="error">{error}</p>}
      {accounts.length === 0 && !loading && (
        <p className="empty">No accounts found</p>
      )}
      <div className="accounts-grid">
        {accounts.map((account) => (
          <div key={account.id} className="account-card">
            <div className="account-header">
              <h3>{account.accountName}</h3>
              <span className="account-type">{account.accountType}</span>
            </div>
            <div className="account-details">
              <p>
                <strong>Account No:</strong> {account.accountNumber}
              </p>
              <p>
                <strong>Balance:</strong> <span className="balance">${account.balance.toFixed(2)}</span>
              </p>
              <p className="created">
                Created: {new Date(account.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="account-actions">
              <button
                className="btn btn-primary"
                onClick={() => onSelectAccount(account.id)}
              >
                View Transactions
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(account.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountList;
