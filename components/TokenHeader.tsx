// components/TokenHeader.tsx
"use client";

import { useState } from "react";

interface TokenHeaderProps {
  token: string;
  onTokenChange: (token: string) => void;
}

export function TokenHeader({ token, onTokenChange }: TokenHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onTokenChange(searchValue.trim().toUpperCase());
      setShowSearch(false);
      setSearchValue("");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
            Token FCS
          </h1>
          
          {showSearch ? (
            <form onSubmit={handleSubmit} className="flex items-center">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Enter token symbol"
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-l text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                autoFocus
              />
              <button 
                type="submit"
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-r text-sm transition-colors"
              >
                Search
              </button>
            </form>
          ) : (
            <button 
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded text-sm transition-colors"
              onClick={() => setShowSearch(true)}
            >
              Search Token
            </button>
          )}
        </div>
      </div>
    </header>
  );
}