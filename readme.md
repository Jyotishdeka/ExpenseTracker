# Expense Tracker Backend

This is the backend service for the Expense Tracker application. It provides APIs to manage expenses, categories, and user authentication.

## Features

- User authentication and authorization
- CRUD operations for expenses
- CRUD operations for categories
- Secure password storage
- JWT token generation and validation

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/expense-tracker-backend.git
```

2. Navigate to the project directory:

```bash
cd expense-tracker-backend
```

3. Install dependencies:

```bash
npm install
```

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Running the Application

1. Start the server:

```bash
npm start
```

2. The server will be running on `http://localhost:3000`.

## API Endpoints

### User Endpoints

- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login a user
- `POST /api/v1/users/logout` - Logout a user
- `POST /api/v1/users/refresh-token` - Refresh access token
- `GET /api/v1/users/current-user` - Get current user details
- `POST /api/v1/users/change-password` - Change current user's password

### Category Endpoints

- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories/create-category` - Create a new category
- `PUT /api/v1/categories/update-category/:id` - Update a category
- `DELETE /api/v1/categories/delete-category/:id` - Delete a category
- `GET /api/v1/categories/get-category/:id` - Get a category by ID

### Budget Endpoints

- `GET /api/v1/budgets` - Get all budgets
- `POST /api/v1/budgets/create-budget` - Create a new budget
- `GET /api/v1/budgets/:id` - Get a budget by ID
- `PUT /api/v1/budgets/update-budget/:id` - Update a budget
- `DELETE /api/v1/budgets/delete-budget/:id` - Delete a budget by ID
- `GET /api/v1/budgets/category/:id` - Get budgets by category ID

### Transaction Endpoints

- `POST /api/v1/transactions/create-transaction` - Create a new transaction

## Schemas

### User Schema

```javascript
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    preferredCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
```

### Transaction schema

```javascript
const transactionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "credit", "debit", "netbanking", "upi", "wallet"],
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    debt: {
      owedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      amount: Number,
      settled: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);
```

### Category Schema

```javascript
const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    icon: { type: String },
  },
  {
    timestamps: true,
  }
);
```

### Budget schema

```javascript
const budgetSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    spent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
```

### Report schema
```javascript
const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  period: { type: String, enum: ['weekly', 'monthly', 'yearly'], required: true },
  income: { type: Number, default: 0 },
  expenses: { type: Number, default: 0 },
  topCategories: [{ category: mongoose.Schema.Types.ObjectId, amount: Number }], // Category-wise spending
  savings: { type: Number, default: 0 },
  debts: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now }
});
```
### SavingGoal schema
```javascript
const SavingsGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }], // Savings deposits
  createdAt: { type: Date, default: Date.now }
});
```

### Recurring Transactions schema
```javascript
const RecurringTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  nextDueDate: { type: Date, required: true },
  autoProcess: { type: Boolean, default: false }, // Auto-process transactions on due date
  paymentMethod: { type: String, enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer'], default: 'cash' }
});
```

### Recurring Transactions schema
```javascript
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['budget', 'recurring', 'goal', 'general'], required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
