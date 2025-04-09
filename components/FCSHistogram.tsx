'use client';

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Percentile {
  percentile: number;
  count: number;
}

// Farcaster purple color
const FARCASTER_PURPLE = 'rgba(147, 51, 234, 0.9)';

export default function FCSHistogram() {
  const [percentiles, setPercentiles] = useState<Percentile[]>([]);
  const [histogramData, setHistogramData] = useState<any[]>([]);
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
        
        // Create histogram data based on the percentile scores
        // This creates bins (buckets) for the FCS score distribution
        if (data && data.length > 0) {
          // First, sort the percentile data by score
          const sortedScores = [...data].sort((a, b) => a.count - b.count);
          
          // Find min and max scores to create range
          const minScore = Math.floor(sortedScores[0].count);
          const maxScore = Math.ceil(sortedScores[sortedScores.length - 1].count);
          
          // Create bins - we'll use 5 buckets for simplicity
          const range = maxScore - minScore;
          const binSize = range / 5;
          
          const bins = [];
          for (let i = 0; i < 5; i++) {
            const start = minScore + (i * binSize);
            const end = minScore + ((i + 1) * binSize);
            bins.push({
              range: `${start.toFixed(2)}-${end.toFixed(2)}`,
              frequency: 0, // Will be calculated from user distribution
              start,
              end
            });
          }
          
          // For this example, we'll create a mock distribution 
          // In a real app, you'd calculate this from the actual user data
          // This is just to simulate what a histogram might look like
          bins[0].frequency = 45; // Many users in the lowest score range
          bins[1].frequency = 30;
          bins[2].frequency = 15;
          bins[3].frequency = 7;
          bins[4].frequency = 3; // Few users in the highest score range
          
          setHistogramData(bins);
        }
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
        <h2 className="text-lg font-medium mb-4">FCS Score Histogram</h2>
        <div className="animate-pulse h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">FCS Score Histogram</h2>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">FCS Score Distribution</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Distribution of users across FCS score ranges
      </p>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={histogramData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="range" 
              label={{ value: 'FCS Score Range', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Number of Users', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Users']}
              labelFormatter={(label) => `FCS Score: ${label}`}
            />
            <Bar dataKey="frequency" fill={FARCASTER_PURPLE} name="Users" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>This histogram shows the distribution of users across different FCS score ranges.</p>
        <p className="mt-1">Note: This uses simulated frequency data as the API only provides percentile breakpoints.</p>
      </div>
    </div>
  );
}