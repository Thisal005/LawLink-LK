import React, { useState } from 'react';
import { Search, X, Calendar, Filter } from 'lucide-react';

const MessageSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery, 'Date filter:', dateFilter);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDateFilter('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="space-y-2">
        {/* Search input */}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-20 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="absolute right-2 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
            
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1 rounded-full ${showFilters ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters section */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-sm border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any time</option>
                <option value="today">Today</option>
                <option value="week">Past week</option>
                <option value="month">Past month</option>
                <option value="custom">Custom range</option>
              </select>
            </div>

            {dateFilter === 'custom' && (
              <div className="flex gap-2">
                <input
                  type="date"
                  className="text-sm border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  className="text-sm border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        )}

        {/* Search results preview - You can customize this based on your needs */}
        {searchQuery && (
          <div className="mt-2 p-2 bg-white border rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">
              Searching for "{searchQuery}"...
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageSearch;