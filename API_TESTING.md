# API Testing Guide

This document provides examples for testing all API endpoints using curl or Postman.

## Backend URL
```
http://localhost:5000/api
```

---

## 1. ACCOUNTS ENDPOINTS

### Get All Accounts
```bash
curl -X GET http://localhost:5000/api/accounts
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "accountNumber": "1001234567",
      "accountName": "John Doe Savings",
      "balance": 5000,
      "accountType": "Savings",
      "createdAt": "2023-01-15T00:00:00.000Z"
    }
  ]
}
```

### Get Single Account
```bash
curl -X GET http://localhost:5000/api/accounts/{accountId}
```

### Create New Account
```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "accountName": "Jane Doe Savings",
    "accountType": "Savings",
    "initialBalance": 10000
  }'
```

### Update Account
```bash
curl -X PATCH http://localhost:5000/api/accounts/{accountId} \
  -H "Content-Type: application/json" \
  -d '{
    "accountName": "Updated Account Name",
    "accountType": "Checking"
  }'
```

### Delete Account
```bash
curl -X DELETE http://localhost:5000/api/accounts/{accountId}
```

---

## 2. TRANSACTIONS ENDPOINTS

### Get All Transactions
```bash
curl -X GET http://localhost:5000/api/transactions
```

### Get Transactions for Specific Account
```bash
curl -X GET "http://localhost:5000/api/transactions?accountId={accountId}"
```

### Get Single Transaction
```bash
curl -X GET http://localhost:5000/api/transactions/{transactionId}
```

### Create New Transaction (Deposit)
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "{accountId}",
    "type": "deposit",
    "amount": 500,
    "description": "Paycheck"
  }'
```

### Create New Transaction (Withdrawal)
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "{accountId}",
    "type": "withdrawal",
    "amount": 100,
    "description": "ATM Withdrawal"
  }'
```

### Create New Transaction (Transfer)
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "{accountId}",
    "type": "transfer",
    "amount": 250,
    "description": "Transfer to John"
  }'
```

### Update Transaction
```bash
curl -X PATCH http://localhost:5000/api/transactions/{transactionId} \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description"
  }'
```

### Delete Transaction
```bash
curl -X DELETE http://localhost:5000/api/transactions/{transactionId}
```

---

## 3. UTILITY ENDPOINTS

### Validate Account Balance
```bash
curl -X GET http://localhost:5000/api/validate-balance/{accountId}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "accountId": "uuid-string",
    "balance": 5000,
    "isValid": true
  }
}
```

### Get Dashboard Summary
```bash
curl -X GET http://localhost:5000/api/dashboard-summary
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalBalance": 7500,
    "totalAccounts": 2,
    "recentTransactions": [
      {
        "id": "uuid-string",
        "accountId": "uuid-string",
        "type": "deposit",
        "amount": 1000,
        "description": "Salary Deposit",
        "date": "2025-11-25T00:00:00.000Z",
        "balance": 5000
      }
    ],
    "lastUpdated": "2025-11-27T12:00:00.000Z"
  }
}
```

---

## Testing with Postman

1. Open Postman
2. Create a new collection "Banking Dashboard"
3. For each endpoint, create a new request with:
   - Method (GET, POST, PATCH, DELETE)
   - URL (e.g., http://localhost:5000/api/accounts)
   - Headers (Content-Type: application/json for POST/PATCH)
   - Body (JSON data for POST/PATCH)

---

## Common Error Responses

### Account Not Found
```json
{
  "success": false,
  "message": "Account not found"
}
```

### Insufficient Funds
```json
{
  "success": false,
  "message": "Insufficient funds"
}
```

### Missing Required Fields
```json
{
  "success": false,
  "message": "Account name and type are required"
}
```

---

## Notes
- Replace `{accountId}` and `{transactionId}` with actual IDs returned from API
- All timestamps are in ISO 8601 format
- Balances are always returned with 2 decimal places
- Deleting a transaction automatically reverses its balance impact
