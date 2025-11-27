const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database
let accounts = [
  {
    id: uuidv4(),
    accountNumber: '1001234567',
    accountName: 'John Doe Savings',
    balance: 5000,
    accountType: 'Savings',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: uuidv4(),
    accountNumber: '1001234568',
    accountName: 'John Doe Checking',
    balance: 2500,
    accountType: 'Checking',
    createdAt: new Date('2023-02-20'),
  },
];

let transactions = [
  {
    id: uuidv4(),
    accountId: accounts[0].id,
    type: 'deposit',
    amount: 1000,
    description: 'Salary Deposit',
    date: new Date('2025-11-25'),
    balance: 5000,
  },
  {
    id: uuidv4(),
    accountId: accounts[0].id,
    type: 'withdrawal',
    amount: 500,
    description: 'ATM Withdrawal',
    date: new Date('2025-11-24'),
    balance: 4000,
  },
  {
    id: uuidv4(),
    accountId: accounts[1].id,
    type: 'transfer',
    amount: 200,
    description: 'Transfer to Savings',
    date: new Date('2025-11-23'),
    balance: 2300,
  },
];

// =============== ACCOUNTS ENDPOINTS ===============

// GET all accounts
app.get('/api/accounts', (req, res) => {
  res.json({ success: true, data: accounts });
});

// GET single account by ID
app.get('/api/accounts/:id', (req, res) => {
  const account = accounts.find((acc) => acc.id === req.params.id);
  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }
  res.json({ success: true, data: account });
});

// POST - Create new account
app.post('/api/accounts', (req, res) => {
  const { accountName, accountType, initialBalance } = req.body;

  if (!accountName || !accountType) {
    return res
      .status(400)
      .json({ success: false, message: 'Account name and type are required' });
  }

  const newAccount = {
    id: uuidv4(),
    accountNumber: Math.floor(1000000000 + Math.random() * 9000000000),
    accountName,
    accountType,
    balance: initialBalance || 0,
    createdAt: new Date(),
  };

  accounts.push(newAccount);
  res.status(201).json({ success: true, data: newAccount });
});

// PATCH - Update account
app.patch('/api/accounts/:id', (req, res) => {
  const account = accounts.find((acc) => acc.id === req.params.id);
  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }

  const { accountName, accountType } = req.body;
  if (accountName) account.accountName = accountName;
  if (accountType) account.accountType = accountType;

  res.json({ success: true, data: account });
});

// DELETE account
app.delete('/api/accounts/:id', (req, res) => {
  const index = accounts.findIndex((acc) => acc.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }

  // Also delete associated transactions
  transactions = transactions.filter((t) => t.accountId !== req.params.id);

  const deletedAccount = accounts.splice(index, 1);
  res.json({ success: true, message: 'Account deleted', data: deletedAccount[0] });
});

// =============== TRANSACTIONS ENDPOINTS ===============

// GET all transactions
app.get('/api/transactions', (req, res) => {
  const { accountId } = req.query;
  let result = transactions;

  if (accountId) {
    result = transactions.filter((t) => t.accountId === accountId);
  }

  res.json({ success: true, data: result });
});

// GET single transaction by ID
app.get('/api/transactions/:id', (req, res) => {
  const transaction = transactions.find((t) => t.id === req.params.id);
  if (!transaction) {
    return res
      .status(404)
      .json({ success: false, message: 'Transaction not found' });
  }
  res.json({ success: true, data: transaction });
});

// POST - Create new transaction
app.post('/api/transactions', (req, res) => {
  const { accountId, type, amount, description } = req.body;

  if (!accountId || !type || !amount) {
    return res
      .status(400)
      .json({
        success: false,
        message: 'Account ID, type, and amount are required',
      });
  }

  const account = accounts.find((acc) => acc.id === accountId);
  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }

  // Validate balance for withdrawal
  if (type === 'withdrawal' && account.balance < amount) {
    return res
      .status(400)
      .json({ success: false, message: 'Insufficient funds' });
  }

  // Update account balance
  if (type === 'deposit') {
    account.balance += amount;
  } else if (type === 'withdrawal' || type === 'transfer') {
    account.balance -= amount;
  }

  const newTransaction = {
    id: uuidv4(),
    accountId,
    type,
    amount,
    description: description || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
    date: new Date(),
    balance: account.balance,
  };

  transactions.push(newTransaction);
  res.status(201).json({ success: true, data: newTransaction });
});

// PATCH - Update transaction (only certain fields)
app.patch('/api/transactions/:id', (req, res) => {
  const transaction = transactions.find((t) => t.id === req.params.id);
  if (!transaction) {
    return res
      .status(404)
      .json({ success: false, message: 'Transaction not found' });
  }

  const { description } = req.body;
  if (description) transaction.description = description;

  res.json({ success: true, data: transaction });
});

// DELETE transaction
app.delete('/api/transactions/:id', (req, res) => {
  const index = transactions.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: 'Transaction not found' });
  }

  const deletedTransaction = transactions.splice(index, 1)[0];
  
  // Reverse the transaction impact on account balance
  const account = accounts.find((acc) => acc.id === deletedTransaction.accountId);
  if (account) {
    if (deletedTransaction.type === 'deposit') {
      account.balance -= deletedTransaction.amount;
    } else if (
      deletedTransaction.type === 'withdrawal' ||
      deletedTransaction.type === 'transfer'
    ) {
      account.balance += deletedTransaction.amount;
    }
  }

  res.json({
    success: true,
    message: 'Transaction deleted',
    data: deletedTransaction,
  });
});

// =============== UTILITY ENDPOINTS ===============

// GET account balance validation
app.get('/api/validate-balance/:accountId', (req, res) => {
  const account = accounts.find((acc) => acc.id === req.params.accountId);
  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }

  res.json({
    success: true,
    data: {
      accountId: account.id,
      balance: account.balance,
      isValid: account.balance >= 0,
    },
  });
});

// GET dashboard summary
app.get('/api/dashboard-summary', (req, res) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalAccounts = accounts.length;
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  res.json({
    success: true,
    data: {
      totalBalance,
      totalAccounts,
      recentTransactions,
      lastUpdated: new Date(),
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Banking Dashboard Backend running on http://localhost:${PORT}`);
});
