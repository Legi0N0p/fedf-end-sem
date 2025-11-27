# Quick Start Guide

## System Requirements
- Node.js v14 or higher
- npm v6 or higher
- Windows PowerShell or Command Prompt
- Port 5000 and 3000 available

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Backend Dependencies
```powershell
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```powershell
cd ../frontend
npm install
```

### Step 3: Start Backend Server (Terminal 1)
```powershell
cd backend
npm start
```
Server will run on: `http://localhost:5000`

### Step 4: Start Frontend Application (Terminal 2)
```powershell
cd frontend
npm start
```
Application will open at: `http://localhost:3000`

---

## 📋 Available Features

### Dashboard Tab
- View total balance across all accounts
- See total number of accounts
- View recent transactions
- Refresh summary at any time

### Accounts Tab
- View all bank accounts in grid layout
- See account type and balance
- View transaction details for each account
- Delete accounts

### Add Transaction Tab
- Select account to transact with
- Choose transaction type (Deposit/Withdrawal/Transfer)
- Enter amount and description
- Add transaction with real-time balance update

### Validation Tab
- Validate all account balances
- View overall balance status
- Identify invalid accounts
- See detailed validation report

---

## 🔧 Troubleshooting

### Issue: "Failed to connect to backend"
**Solution:** Ensure backend is running on port 5000
```powershell
cd backend
npm start
```

### Issue: "Port 5000 already in use"
**Solution:** Change PORT in `backend/server.js` to unused port (e.g., 5001)

### Issue: "Port 3000 already in use"
**Solution:** Frontend will prompt to use another port, type 'y' to continue

### Issue: Dependencies not installing
**Solution:** Clear npm cache and retry
```powershell
npm cache clean --force
npm install
```

---

## 📊 Default Test Data

The application comes with pre-populated data:

**Accounts:**
- John Doe Savings: $5,000
- John Doe Checking: $2,500

**Sample Transactions:**
- Salary Deposit: +$1,000
- ATM Withdrawal: -$500
- Transfer: -$200

---

## 🔑 Key Commands

### Backend
```powershell
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)
```

### Frontend
```powershell
npm start          # Start dev server
npm run build      # Create production build
npm test           # Run tests
```

---

## 💡 Usage Tips

1. **Create Multiple Accounts:** Use Accounts tab to add new accounts
2. **Test Transactions:** Try deposits, withdrawals, and transfers
3. **Monitor Balance:** Dashboard shows real-time balance updates
4. **Validate Safety:** Use Validation tab to ensure data integrity
5. **Filter History:** Sort transactions by date or amount in history

---

## 📚 API Documentation

See `API_TESTING.md` for complete API endpoint documentation with curl examples.

---

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can view accounts in Accounts tab
- [ ] Can add transactions in Transaction tab
- [ ] Dashboard shows correct totals
- [ ] Can delete transactions
- [ ] Balance validation works

---

## 🆘 Need Help?

1. Check browser console for frontend errors (F12)
2. Check terminal for backend errors
3. Verify both servers are running
4. Clear browser cache if UI not updating
5. Restart both servers if issues persist

---

**Happy Banking! 🏦**
