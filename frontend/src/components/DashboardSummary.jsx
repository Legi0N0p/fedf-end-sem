import React, { useState, useEffect } from 'react';
import { getDashboardSummary } from '../api';
import './DashboardSummary.css';

function DashboardSummary({ refreshTrigger }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboardSummary();
      setSummary(response.data.data);
    } catch (err) {
      setError('Failed to fetch dashboard summary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-summary loading">Loading summary...</div>;
  }

  if (error) {
    return <div className="dashboard-summary error">{error}</div>;
  }

  if (!summary) {
    return <div className="dashboard-summary empty">No data available</div>;
  }

  return (
    <div className="dashboard-summary">
      <h2>Dashboard Summary</h2>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-header">
            <h3>Total Balance</h3>
          </div>
          <div className="card-content">
            <p className="amount">${summary.totalBalance.toFixed(2)}</p>
            <p className="subtitle">Across all accounts</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <h3>Total Accounts</h3>
          </div>
          <div className="card-content">
            <p className="count">{summary.totalAccounts}</p>
            <p className="subtitle">Active accounts</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <h3>Last Updated</h3>
          </div>
          <div className="card-content">
            <p className="time">{new Date(summary.lastUpdated).toLocaleTimeString()}</p>
            <p className="subtitle">{new Date(summary.lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        {summary.recentTransactions.length === 0 ? (
          <p className="empty">No recent transactions</p>
        ) : (
          <div className="transactions-list">
            {summary.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <p className="description">{transaction.description}</p>
                  <p className="date">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="btn-refresh" onClick={fetchSummary}>
        Refresh Summary
      </button>
    </div>
  );
}

export default DashboardSummary;
