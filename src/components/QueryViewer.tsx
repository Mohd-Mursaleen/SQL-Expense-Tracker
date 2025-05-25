
import { useState } from 'react';
import { Code, Clock, Database, Play, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface QueryViewerProps {
  lastQuery: string;
  queryHistory: Array<{ query: string; timestamp: string; action: string }>;
  totalExpenses: number;
  filteredExpenses: number;
}

export const QueryViewer = ({ 
  lastQuery, 
  queryHistory, 
  totalExpenses, 
  filteredExpenses 
}: QueryViewerProps) => {
  const [selectedTab, setSelectedTab] = useState('current');

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 h-fit">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">SQL Query Viewer</h2>
            <p className="text-sm text-gray-600">Real-time SQL queries for your actions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200/50">
            <div className="text-sm text-gray-600">Total Records</div>
            <div className="text-2xl font-bold text-blue-600">{totalExpenses}</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-200/50">
            <div className="text-sm text-gray-600">Filtered Results</div>
            <div className="text-2xl font-bold text-green-600">{filteredExpenses}</div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100/70">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Current Query
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Query History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Play className="w-4 h-4 text-green-500" />
                  <span>Last executed query</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Real-time</span>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-green-400 font-mono whitespace-pre-wrap">
                    {lastQuery}
                  </code>
                </pre>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200/50">
                <h4 className="font-semibold text-gray-800 mb-2">Query Explanation:</h4>
                <p className="text-sm text-gray-700">
                  {lastQuery.includes('SELECT') && 'This query retrieves expense records from the database.'}
                  {lastQuery.includes('INSERT') && 'This query adds a new expense record to the database.'}
                  {lastQuery.includes('UPDATE') && 'This query modifies an existing expense record.'}
                  {lastQuery.includes('DELETE') && 'This query removes an expense record from the database.'}
                  {lastQuery.includes('WHERE') && ' It includes filtering conditions.'}
                  {lastQuery.includes('ORDER BY') && ' Results are sorted by the specified field.'}
                  {lastQuery.includes('ILIKE') && ' It uses case-insensitive text search.'}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {queryHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No query history yet</p>
                </div>
              ) : (
                queryHistory.map((item, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fade-in"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800">{item.action}</span>
                      <span className="text-xs text-gray-500">{formatTimestamp(item.timestamp)}</span>
                    </div>
                    <div className="bg-gray-800 rounded p-2">
                      <code className="text-xs text-green-400 font-mono block overflow-x-auto whitespace-pre-wrap">
                        {item.query}
                      </code>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
