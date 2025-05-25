
export interface ExpenseData {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  isPaid: boolean;
  createdAt: string;
}

class JsonDatabase {
  private storageKey = 'expense_tracker_db';

  // Get all expenses from localStorage
  getAllExpenses(): ExpenseData[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from JSON database:', error);
      return [];
    }
  }

  // Save expenses to localStorage
  saveExpenses(expenses: ExpenseData[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(expenses, null, 2));
    } catch (error) {
      console.error('Error saving to JSON database:', error);
    }
  }

  // Add a new expense
  addExpense(expense: ExpenseData): void {
    const expenses = this.getAllExpenses();
    expenses.unshift(expense);
    this.saveExpenses(expenses);
  }

  // Delete an expense
  deleteExpense(id: string): void {
    const expenses = this.getAllExpenses();
    const filtered = expenses.filter(expense => expense.id !== id);
    this.saveExpenses(filtered);
  }

  // Update an expense
  updateExpense(id: string, updates: Partial<ExpenseData>): void {
    const expenses = this.getAllExpenses();
    const index = expenses.findIndex(expense => expense.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates };
      this.saveExpenses(expenses);
    }
  }

  // Initialize with sample data if empty
  initializeSampleData(): void {
    const existing = this.getAllExpenses();
    if (existing.length === 0) {
      const sampleData: ExpenseData[] = [
        {
          id: '1',
          description: 'Grocery Shopping',
          amount: 85.50,
          category: 'Food',
          date: '2024-05-24',
          isPaid: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          description: 'Gas Station',
          amount: 45.00,
          category: 'Transportation',
          date: '2024-05-23',
          isPaid: false,
          createdAt: new Date().toISOString()
        }
      ];
      this.saveExpenses(sampleData);
    }
  }
}

export const jsonDb = new JsonDatabase();
