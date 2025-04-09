// components/PclankTesting.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PclankTesting = () => {
  // State for token addresses
  const [tokenAddress1, setTokenAddress1] = useState('0x06f71fb90f84b35302d132322a3c90e4477333b0');
  const [tokenAddress2, setTokenAddress2] = useState('0x20dd04c17afd5c9a8b3f2cdacaa8ee7907385bef');
  const [tokenData, setTokenData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Farcaster purple color for consistent styling
  const FARCASTER_PURPLE = 'rgba(147, 51, 234, 0.9)';
  const SECONDARY_COLOR = 'rgba(59, 130, 246, 0.9)';
  
  const fetchWeightedHoldersData = async () => {
    if (!tokenAddress1 && !tokenAddress2) {
      setError("Please enter at least one token address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the API endpoint we just created
      const queryParams = new URLSearchParams();
      if (tokenAddress1) queryParams.append('address1', tokenAddress1);
      if (tokenAddress2) queryParams.append('address2', tokenAddress2);
      
      const response = await fetch(`/api/weighted-holders?${queryParams.toString()}&t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      setTokenData(data);
    } catch (err) {
      console.error("Error fetching weighted holders data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchWeightedHoldersData();
  }, []);

  // Prepare data for the charts
  const chartData = tokenData.map(token => ({
    name: token.symbol || token.name || token.token.substring(0, 8),
    weightedHolders: token.weighted_holders,
    totalHolders: token.holders_total,
    weightedToTotalRatio: token.holders_total ? 
      (token.weighted_holders / token.holders_total) : 0
  }));

  // Format for displaying token addresses
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-medium mb-6">Token Weighted Holders Comparison</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Token Address 1
          </label>
          <div className="flex">
            <input
              type="text"
              value={tokenAddress1}
              onChange={(e) => setTokenAddress1(e.target.value)}
              className="flex-1 shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md"
              placeholder="0x..."
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Token Address 2
          </label>
          <div className="flex">
            <input
              type="text"
              value={tokenAddress2}
              onChange={(e) => setTokenAddress2(e.target.value)}
              className="flex-1 shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md"
              placeholder="0x..."
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mb-8">
        <button
          onClick={fetchWeightedHoldersData}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          style={{ backgroundColor: FARCASTER_PURPLE }}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Compare Tokens'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-600 dark:text-red-400 mb-6">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: FARCASTER_PURPLE }}></div>
        </div>
      ) : (
        tokenData.length > 0 && (
          <div className="space-y-8">
            {/* Token Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tokenData.map((token, index) => (
                <div key={token.token} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">
                    {token.name || `Token ${index + 1}`} ({token.symbol || formatAddress(token.token)})
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {formatAddress(token.token)}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Weighted Holders</div>
                      <div className="text-2xl font-light mt-1" style={{ color: FARCASTER_PURPLE }}>
                        {token.weighted_holders || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Holders</div>
                      <div className="text-2xl font-light mt-1">
                        {token.holders_total || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Charts */}
            {chartData.length > 0 && (
              <div className="space-y-8">
                {/* Weighted Holders vs Total Holders */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Holders Comparison</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="weightedHolders" name="Weighted Holders" fill={FARCASTER_PURPLE} />
                        <Bar dataKey="totalHolders" name="Total Holders" fill={SECONDARY_COLOR} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Weighted to Total Ratio */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Weighted/Total Holders Ratio</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 'auto']} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="weightedToTotalRatio" name="Weighted/Total Ratio" fill={FARCASTER_PURPLE} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    This ratio indicates the average weighting factor applied to holders. A higher ratio means more holders have Farcaster accounts with good FCS scores.
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default PclankTesting;