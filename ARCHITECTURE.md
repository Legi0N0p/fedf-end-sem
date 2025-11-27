# Component Architecture & Data Flow

## Application Structure

```
App (Root Component)
├── Header (Navigation & Branding)
│   └── Online Banking Dashboard Title
├── Navigation Bar
│   ├── Dashboard Tab
│   ├── Accounts Tab
│   ├── Add Transaction Tab
│   └── Validate Balances Tab
├── Main Content Area
│   ├── Dashboard Tab View
│   │   ├── DashboardSummary
│   │   │   ├── Total Balance Card
│   │   │   ├── Total Accounts Card
│   │   │   ├── Last Updated Card
│   │   │   └── Recent Transactions List
│   │   └── TransactionHistory
│   │       ├── Sort/Filter Controls
│   │       └── Transactions Table
│   ├── Accounts Tab View
│   │   └── AccountList
│   │       ├── Account Cards Grid
│   │       │   ├── Account Details
│   │       │   ├── View Transactions Button
│   │       │   └── Delete Button
│   │       └── Refresh Controls
│   ├── Add Transaction Tab View
│   │   ├── AddTransaction
│   │   │   ├── Account Selector
│   │   │   ├── Transaction Type Selector
│   │   │   ├── Amount Input
│   │   │   ├── Description Input
│   │   │   └── Submit Button
│   │   └── TransactionHistory
│   │       ├── Sort/Filter Controls
│   │       └── Transactions Table
│   └── Validate Balances Tab View
│       └── ValidateBalances
│           ├── Overall Status Card
│           ├── Invalid Accounts Alert
│           ├── Validation Report Table
│           └── Re-validate Button
└── Footer
    └── Copyright Information
```

---

## Component Hierarchy

### Level 1 (Root)
- **App.js** - Main application component, handles tab state and navigation

### Level 2 (Tab Container Components)
- **DashboardSummary.js** - Dashboard overview and summary
- **AccountList.js** - List all accounts
- **AddTransaction.js** - Add new transaction form
- **ValidateBalances.js** - Balance validation

### Level 3 (Child Components)
- **TransactionHistory.js** - Shared transaction history display (used in Dashboard & Add Transaction tabs)

### Utility
- **api.js** - Centralized API client

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────┐
│          App Component State                │
│  ├─ selectedAccountId                       │
│  ├─ refreshKey (for re-rendering)          │
│  └─ activeTab (dashboard|accounts|...)     │
└─────────────────────────────────────────────┘
           │
           ├──────────────────────────────────────────┐
           │                                          │
           ▼                                          ▼
    ┌─────────────────┐              ┌──────────────────────┐
    │ Local Component │              │ API Calls            │
    │ State (each)    │              │ axios to backend     │
    │                 │              │                      │
    │ ├─ accounts     │              ├─ getAccounts()       │
    │ ├─ transactions │              ├─ getTransactions()   │
    │ ├─ loading      │              ├─ createTransaction() │
    │ ├─ error        │              ├─ deleteAccount()     │
    │ └─ validationResults           ├─ validateBalance()   │
    │                 │              ├─ getDashboardSummary()
    └─────────────────┘              └──────────────────────┘
           │                                  │
           │                                  ▼
           │                         ┌──────────────────┐
           │                         │  Express Backend │
           │                         │  on Port 5000    │
           │                         │                  │
           │                         ├─ /api/accounts  │
           │                         ├─ /api/transactions
           │                         ├─ /api/validate-balance
           │                         └─ /api/dashboard-summary
           │                                  │
           │                                  ▼
           │                         ┌──────────────────┐
           │                         │ In-Memory DB     │
           │                         │                  │
           │                         ├─ accounts[]     │
           │                         └─ transactions[] │
           │                                  │
           └──────────────────────────────────┘
                        │
                        ▼
                   ┌─────────────┐
                   │ UI Updates  │
                   │             │
                   └─────────────┘
```

---

## Component Communication

### Parent to Child (Props)
```
App
├─> AccountList
│   └─ onSelectAccount (callback function)
├─> AddTransaction
│   ├─ accountId (selected account)
│   └─ onTransactionAdded (callback)
├─> TransactionHistory
│   ├─ accountId (filter transactions)
│   └─ refreshTrigger (re-fetch signal)
├─> DashboardSummary
│   └─ refreshTrigger (re-fetch signal)
└─> ValidateBalances
    └─ refreshTrigger (re-fetch signal)
```

### Child to Parent (Callbacks)
```
AccountList -> App
├─ onSelectAccount(accountId)
└─ Triggers: setSelectedAccountId, switch to transactions tab

AddTransaction -> App
├─ onTransactionAdded(transaction)
└─ Triggers: setRefreshKey to refresh all data

TransactionHistory -> (internal state only)

DashboardSummary -> (internal state only)

ValidateBalances -> (internal state only)
```

---

## State Management Flow

### App-Level State
```javascript
const [selectedAccountId, setSelectedAccountId] = useState(null)
const [refreshKey, setRefreshKey] = useState(0)
const [activeTab, setActiveTab] = useState('dashboard')
```

### Component-Level State
Each component manages its own:
- `accounts` / `transactions` (data from API)
- `loading` (loading state)
- `error` (error message)
- Form state (for AddTransaction)

### Re-render Triggers
- User clicks navigation tab
- User selects an account
- New transaction added (refreshKey updated)
- User clicks refresh button
- Data fetch completes

---

## API Request/Response Flow

### Example: Create Transaction

```
1. User fills form in AddTransaction
   │
2. User clicks "Add Transaction" button
   │
3. handleSubmit() validates input
   │
4. createTransaction(data) API call
   │
5. Backend validates data
   │
6. Backend updates account balance
   │
7. Backend creates transaction record
   │
8. Backend returns success response
   │
9. Frontend sets success message
   │
10. Parent receives onTransactionAdded callback
    │
11. App updates refreshKey state
    │
12. All components with refreshTrigger re-fetch data
    │
13. UI updates with new data
```

---

## Component Responsibilities

### App.js
- Manage tab navigation state
- Manage selected account state
- Manage global refresh trigger
- Render appropriate tab content
- Handle navigation between sections

### DashboardSummary.js
- Fetch dashboard summary from API
- Display summary cards (balance, accounts)
- Show recent transactions
- Provide refresh button

### AccountList.js
- Fetch all accounts from API
- Display accounts in grid
- Show account details
- Handle account selection
- Handle account deletion

### AddTransaction.js
- Fetch accounts list
- Display transaction form
- Handle form submission
- Validate input data
- Call transaction creation API
- Show success/error messages

### TransactionHistory.js
- Fetch transactions (filtered by account if provided)
- Display transactions in table
- Provide sorting options
- Provide filtering options
- Handle transaction deletion
- Show empty state when no transactions

### ValidateBalances.js
- Fetch all accounts
- Validate each account balance
- Show overall validation status
- List invalid accounts
- Display validation report table

---

## Error Handling Flow

```
Component Makes API Call
       │
       ├─> Success Response
       │   └─> Update component state with data
       │
       └─> Error Response
           └─> Set error state
               └─> Display error message to user
                   └─> Provide retry option
```

---

## Performance Optimizations

1. **Lazy Loading**: Components only fetch data when needed
2. **Selective Re-renders**: Only affected components update
3. **Caching**: refreshKey triggers selective refreshes
4. **Conditional Rendering**: Show only active tab content
5. **Error Boundaries**: Graceful error handling

---

## Data Validation

### Frontend Validation (AddTransaction)
- Account selected: required
- Amount: required, must be positive number
- For withdrawal: amount ≤ balance

### Backend Validation (server.js)
- Account exists: required
- Transaction type: one of [deposit, withdrawal, transfer]
- Amount: required, must be positive
- For withdrawal: amount ≤ current balance

---

## Mobile Responsiveness

- **Breakpoint**: 768px and below
- **Adjustments**:
  - Navigation: wraps on small screens
  - Grid: single column on mobile
  - Table: becomes scrollable
  - Cards: full width on mobile
  - Form: stacked layout

---

## Navigation Flow

```
Dashboard Tab
├─ View total balance
├─ View account count
├─ See recent transactions
└─ Click account to go to transactions

Accounts Tab
├─ View all accounts in grid
├─ Click "View Transactions" → Go to Transactions tab
└─ Delete account button

Add Transaction Tab
├─ Select account
├─ Fill transaction form
├─ Submit and see result
└─ View transaction history below

Validate Balances Tab
├─ See overall status
├─ View detailed report
└─ Re-validate all accounts
```

---

## Component Lifecycle

### Component Mount
1. Component renders
2. useEffect runs
3. API call to fetch data
4. Set loading state
5. Receive response
6. Update component state
7. Component re-renders with data

### Data Refresh
1. Parent passes new refreshTrigger prop
2. Component's useEffect dependency triggers
3. API call made
4. Data updated
5. Component re-renders

### Component Unmount
1. Cleanup of timers/subscriptions (none in current implementation)
2. Component removed from DOM

---

This architecture provides:
✅ Clear separation of concerns
✅ Reusable components
✅ Predictable data flow
✅ Easy to debug and test
✅ Scalable structure
