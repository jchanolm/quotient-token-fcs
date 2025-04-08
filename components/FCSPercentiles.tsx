'use client';

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Percentile {
  percentile: number;
  count: number;
}

export default function FCSPercentiles() {
  const [percentiles, setPercentiles] = useState<Percentile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPercentiles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Add timestamp to prevent caching
        const response = await fetch(`/api/fcs-percentiles?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch FCS percentiles');
        }
        
        const data = await response.json();
        setPercentiles(data || []);
      } catch (err) {
        console.error('Error fetching FCS percentiles:', err);
        setError('Failed to load percentile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPercentiles();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">FCS Percentiles</h2>
        <div className="animate-pulse h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">FCS Percentiles</h2>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  // Format data for display
  const formattedData = percentiles.map(item => ({
    name: `${item.percentile}th`,
    score: item.count
  }));

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">FCS Score Distribution</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Shows FCS scores at different percentile thresholds
      </p>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              label={{ value: 'Percentile', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'FCS Score', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => [`${value}`, 'FCS Score']}
              labelFormatter={(label) => `${label} Percentile`}
            />
            <Bar dataKey="score" fill="#8884d8" name="FCS Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>The chart shows FCS scores at the 25th, 50th, 75th, 90th, and 95th percentiles.</p>
      </div>
    </div>
  );
}