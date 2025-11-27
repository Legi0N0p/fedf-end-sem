import React, { useState, useEffect } from 'react';
import { getTransactions, deleteTransaction } from '../api';
import './TransactionHistory.css';

function TransactionHistory({ accountId, refreshTrigger }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (accountId) {
      fetchTransactions();
    }
  }, [accountId, refreshTrigger]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTransactions(accountId);
      setTransactions(response.data.data);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(transactionId);
        fetchTransactions();
      } catch (err) {
        setError('Failed to delete transaction');
        console.error(err);
      }
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  const filteredTransactions = sortedTransactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  if (!accountId) {
    return (
      <div className="transaction-history">
        <p className="empty">Select an account to view transactions</p>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>

      <div className="filters">
        <div className="filter-group">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter Type:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Transactions</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="transfer">Transfers</option>
          </select>
        </div>
      </div>

      {loading && <p className="loading">Loading transactions...</p>}
      {error && <p className="error">{error}</p>}
      {filteredTransactions.length === 0 && !loading && (
        <p className="empty">No transactions found</p>
      )}

      <div className="transactions-table">
        {filteredTransactions.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className={`transaction-${transaction.type}`}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${transaction.type}`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td>{transaction.description}</td>
                  <td className="amount">
                    <span className={transaction.type === 'deposit' ? 'positive' : 'negative'}>
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="balance">${transaction.balance.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(transaction.id)}
                      title="Delete transaction"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
