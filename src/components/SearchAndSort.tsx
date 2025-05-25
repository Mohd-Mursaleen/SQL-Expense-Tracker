
import { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface SearchAndSortProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  sortBy: 'date' | 'amount' | 'category' | 'status';
  sortOrder: 'asc' | 'desc';
  onSort: (field: 'date' | 'amount' | 'category' | 'status', order: 'asc' | 'desc') => void;
}

export const SearchAndSort = ({ 
  searchTerm, 
  onSearch, 
  sortBy, 
  sortOrder, 
  onSort 
}: SearchAndSortProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
    onSearch(value);
  };

  const handleSortFieldChange = (field: string) => {
    onSort(field as any, sortOrder);
  };

  const toggleSortOrder = () => {
    onSort(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search expenses..."
          value={localSearchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Sort Controls */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Select value={sortBy} onValueChange={handleSortFieldChange}>
            <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-purple-500">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="date" className="hover:bg-purple-50">Date</SelectItem>
              <SelectItem value="amount" className="hover:bg-purple-50">Amount</SelectItem>
              <SelectItem value="category" className="hover:bg-purple-50">Category</SelectItem>
              <SelectItem value="status" className="hover:bg-purple-50">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          onClick={toggleSortOrder}
          className="flex items-center gap-2 transition-all duration-300 hover:bg-purple-50 hover:border-purple-300"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </Button>
      </div>

      {(searchTerm || sortBy !== 'date' || sortOrder !== 'desc') && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm animate-scale-in">
              Search: "{searchTerm}"
            </div>
          )}
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm animate-scale-in">
            Sort: {sortBy} ({sortOrder})
          </div>
        </div>
      )}
    </div>
  );
};
