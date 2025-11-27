import React, { useState } from 'react';
import { createTransaction, getAccounts } from '../api';
import './AddTransaction.css';

function AddTransaction({ accountId, onTransactionAdded }) {
  const [formData, setFormData] = useState({
    type: 'deposit',
    amount: '',
    description: '',
  });
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(accountId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await getAccounts();
      setAccounts(response.data.data);
      if (!selectedAccountId && response.data.data.length > 0) {
        setSelectedAccountId(response.data.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch accounts', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAccountChange = (e) => {
    setSelectedAccountId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!selectedAccountId || !formData.amount) {
      setError('Please select an account and enter an amount');
      setLoading(false);
      return;
    }

    try {
      const transactionData = {
        accountId: selectedAccountId,
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
      };

      const response = await createTransaction(transactionData);
      setSuccess(true);
      setFormData({
        type: 'deposit',
        amount: '',
        description: '',
      });

      if (onTransactionAdded) {
        onTransactionAdded(response.data.data);
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-transaction">
      <h2>Add Transaction</h2>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Transaction added successfully!</div>}

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label>Select Account</label>
          <select
            value={selectedAccountId}
            onChange={handleAccountChange}
            required
          >
            <option value="">-- Choose an account --</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountName} (${account.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Transaction Type</label>
          <select name="type" value={formData.type} onChange={handleInputChange}>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter transaction description (optional)"
          />
        </div>

        <button type="submit" className="btn btn-submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}

export default AddTransaction;
