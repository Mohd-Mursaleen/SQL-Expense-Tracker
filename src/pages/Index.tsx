import { useState, useEffect } from 'react';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { QueryViewer } from '@/components/QueryViewer';
import { SearchAndSort } from '@/components/SearchAndSort';
import { jsonDb, ExpenseData } from '@/services/jsonDatabase';
import { Plus, DollarSign } from 'lucide-react';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  isPaid: boolean;
  createdAt: string;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showForm, setShowForm] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [queryHistory, setQueryHistory] = useState<Array<{ query: string; timestamp: string; action: string }>>([]);

  // Load data from JSON database on component mount
  useEffect(() => {
    jsonDb.initializeSampleData();
    const loadedExpenses = jsonDb.getAllExpenses();
    setExpenses(loadedExpenses);
    
    const initQuery = `SELECT * FROM expenses ORDER BY date DESC;`;
    setLastQuery(initQuery);
    addToQueryHistory(initQuery, 'Initial Load');
  }, []);

  const addToQueryHistory = (query: string, action: string) => {
    setQueryHistory(prev => [
      { query, timestamp: new Date().toISOString(), action },
      ...prev.slice(0, 9) // Keep last 10 queries
    ]);
  };

  const addExpense = (newExpense: Omit<Expense, 'id' | 'createdAt'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    // Save to JSON database
    jsonDb.addExpense(expense);
    
    // Update state
    setExpenses(prev => [expense, ...prev]);
    
    const query = `INSERT INTO expenses (description, amount, category, date, is_paid, created_at) 
VALUES ('${expense.description}', ${expense.amount}, '${expense.category}', '${expense.date}', ${expense.isPaid}, '${expense.createdAt}');`;
    
    setLastQuery(query);
    addToQueryHistory(query, 'Add Expense');
    setShowForm(false);
  };

  const deleteExpense = (id: string) => {
    // Delete from JSON database
    jsonDb.deleteExpense(id);
    
    // Update state
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    
    const query = `DELETE FROM expenses WHERE id = '${id}';`;
    setLastQuery(query);
    addToQueryHistory(query, 'Delete Expense');
  };

  const togglePaidStatus = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;

    const newStatus = !expense.isPaid;
    
    // Update in JSON database
    jsonDb.updateExpense(id, { isPaid: newStatus });
    
    // Update state
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id 
          ? { ...expense, isPaid: newStatus }
          : expense
      )
    );

    const query = `UPDATE expenses SET is_paid = ${newStatus} WHERE id = '${id}';`;
    
    setLastQuery(query);
    addToQueryHistory(query, 'Toggle Payment Status');
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    let query = `SELECT * FROM expenses`;
    if (term) {
      query += ` WHERE description ILIKE '%${term}%' OR category ILIKE '%${term}%'`;
    }
    query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()};`;
    
    setLastQuery(query);
    addToQueryHistory(query, `Search: "${term}"`);
  };

  const handleSort = (field: typeof sortBy, order: typeof sortOrder) => {
    setSortBy(field);
    setSortOrder(order);
    
    let query = `SELECT * FROM expenses`;
    if (searchTerm) {
      query += ` WHERE description ILIKE '%${searchTerm}%' OR category ILIKE '%${searchTerm}%'`;
    }
    query += ` ORDER BY ${field} ${order.toUpperCase()};`;
    
    setLastQuery(query);
    addToQueryHistory(query, `Sort by ${field} ${order}`);
  };

  // Filter and sort expenses based on current state
  const filteredAndSortedExpenses = expenses
    .filter(expense => 
      !searchTerm || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'status') {
        aValue = a.isPaid;
        bValue = b.isPaid;
      }
      
      if (sortBy === 'amount') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }
      
      if (typeof aValue === 'boolean') {
        if (aValue === bValue) return 0;
        return sortOrder === 'asc' 
          ? (aValue ? 1 : -1)
          : (aValue ? -1 : 1);
      }
      
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = expenses.filter(e => e.isPaid).reduce((sum, expense) => sum + expense.amount, 0);
  const unpaidExpenses = totalExpenses - paidExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            SQL Expense Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Learn SQL by managing expenses - see queries in real-time!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 hover-scale animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-purple-600">${totalExpenses.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 hover-scale animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Paid</p>
                <p className="text-2xl font-bold text-green-600">${paidExpenses.toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 hover-scale animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unpaid</p>
                <p className="text-2xl font-bold text-red-600">${unpaidExpenses.toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Expense Management */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Expense Manager</h2>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover-scale"
                >
                  <Plus className="w-4 h-4" />
                  Add Expense
                </button>
              </div>

              {showForm && (
                <div className="mb-6 animate-scale-in">
                  <ExpenseForm onSubmit={addExpense} onCancel={() => setShowForm(false)} />
                </div>
              )}

              <SearchAndSort
                searchTerm={searchTerm}
                onSearch={handleSearch}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </div>

            <ExpenseList
              expenses={filteredAndSortedExpenses}
              onDelete={deleteExpense}
              onTogglePaid={togglePaidStatus}
            />
          </div>

          {/* Right Panel - SQL Query Viewer */}
          <div className="animate-fade-in">
            <QueryViewer 
              lastQuery={lastQuery} 
              queryHistory={queryHistory}
              totalExpenses={expenses.length}
              filteredExpenses={filteredAndSortedExpenses.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
