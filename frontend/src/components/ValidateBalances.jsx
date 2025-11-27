import React, { useState, useEffect } from 'react';
import { getAccounts, validateBalance } from '../api';
import './ValidateBalances.css';

function ValidateBalances({ refreshTrigger }) {
  const [accounts, setAccounts] = useState([]);
  const [validationResults, setValidationResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAccountsAndValidate();
  }, [refreshTrigger]);

  const fetchAccountsAndValidate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAccounts();
      setAccounts(response.data.data);
      
      // Validate all accounts
      const results = {};
      for (const account of response.data.data) {
        try {
          const validationResponse = await validateBalance(account.id);
          results[account.id] = validationResponse.data.data;
        } catch (err) {
          console.error(`Failed to validate account ${account.id}`, err);
          results[account.id] = {
            accountId: account.id,
            balance: account.balance,
            isValid: false,
            error: 'Validation failed',
          };
        }
      }
      setValidationResults(results);
    } catch (err) {
      setError('Failed to fetch accounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="validate-balances loading">Validating balances...</div>;
  }

  if (error) {
    return <div className="validate-balances error">{error}</div>;
  }

  const allValid = Object.values(validationResults).every((result) => result.isValid !== false);
  const invalidAccounts = accounts.filter(
    (acc) => validationResults[acc.id] && !validationResults[acc.id].isValid
  );

  return (
    <div className="validate-balances">
      <h2>Balance Validation</h2>

      <div className="validation-status">
        <div className={`status-card ${allValid ? 'valid' : 'invalid'}`}>
          <h3>Overall Status</h3>
          <p className="status-text">
            {allValid ? '✓ All Balances Valid' : '✗ Some Issues Found'}
          </p>
          <p className="status-detail">
            {Object.keys(validationResults).length} accounts checked
          </p>
        </div>
      </div>

      {invalidAccounts.length > 0 && (
        <div className="invalid-accounts">
          <h3>⚠️ Invalid Accounts</h3>
          <div className="accounts-list">
            {invalidAccounts.map((account) => (
              <div key={account.id} className="account-alert">
                <p>
                  <strong>{account.accountName}</strong> (
                  {account.accountNumber})
                </p>
                <p>Balance: ${account.balance.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="validation-details">
        <h3>Detailed Validation Report</h3>
        <div className="validation-table">
          <table>
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Account Number</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => {
                const validation = validationResults[account.id];
                const isValid = validation?.isValid !== false;
                return (
                  <tr key={account.id} className={isValid ? 'valid' : 'invalid'}>
                    <td>{account.accountName}</td>
                    <td>{account.accountNumber}</td>
                    <td>${account.balance.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${isValid ? 'valid' : 'invalid'}`}>
                        {isValid ? '✓ Valid' : '✗ Invalid'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <button className="btn-validate" onClick={fetchAccountsAndValidate}>
        Re-Validate All Accounts
      </button>
    </div>
  );
}

export default ValidateBalances;
