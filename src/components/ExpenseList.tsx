
import { Expense } from '@/pages/Index';
import { Trash2, Calendar, DollarSign, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onTogglePaid: (id: string) => void;
}

export const ExpenseList = ({ expenses, onDelete, onTogglePaid }: ExpenseListProps) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/50 text-center animate-fade-in">
        <div className="text-gray-400 mb-4">
          <DollarSign className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No expenses yet</h3>
        <p className="text-gray-500">Add your first expense to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense, index) => (
        <div
          key={expense.id}
          className="bg-white/70 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => onTogglePaid(expense.id)}
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                    expense.isPaid
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {expense.isPaid && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-1 bg-white rounded-full transform rotate-45 translate-y-0.5"></div>
                      <div className="w-1 h-2 bg-white rounded-full transform -rotate-45 -translate-x-1 -translate-y-0.5"></div>
                    </div>
                  )}
                </button>
                
                <h3 className={`font-semibold transition-all duration-300 ${
                  expense.isPaid ? 'text-gray-500 line-through' : 'text-gray-800'
                }`}>
                  {expense.description}
                </h3>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="font-medium">${expense.amount.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4 text-blue-500" />
                  <span>{expense.category}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>{new Date(expense.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  expense.isPaid
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {expense.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTogglePaid(expense.id)}
                className={`transition-all duration-300 ${
                  expense.isPaid
                    ? 'border-red-300 text-red-600 hover:bg-red-50'
                    : 'border-green-300 text-green-600 hover:bg-green-50'
                }`}
              >
                {expense.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(expense.id)}
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
