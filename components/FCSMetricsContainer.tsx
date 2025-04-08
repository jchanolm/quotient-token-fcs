// components/FCSMetricsContainer.tsx
'use client';

import { useEffect, useState } from 'react';
import AverageScoreDisplay from './AverageScoreDisplay';
import ScoreDistributionDisplay from './ScoreDistributionDisplay';

interface FCSMetricsContainerProps {
  tokenAddress: string;
}

export default function FCSMetricsContainer({ tokenAddress }: FCSMetricsContainerProps) {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/fcs-metrics');
        
        if (!response.ok) {
          throw new Error('Failed to fetch FCS metrics');
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        setMetrics(data[0]?.data || null);
      } catch (err) {
        console.error('Error fetching FCS metrics:', err);
        setError('Failed to load FCS metrics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [tokenAddress]);

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  // Define the type for metrics to fix TypeScript errors
  interface Metrics {
    avg_score: number;
    score_distribution: any[];
  }

  // Type assertion to help TypeScript understand the structure
  const typedMetrics = metrics as Metrics | null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <AverageScoreDisplay 
        avgScore={typedMetrics?.avg_score || 0} 
        isLoading={isLoading} 
      />
      
      <ScoreDistributionDisplay 
        scoreDistribution={typedMetrics?.score_distribution || []} 
        isLoading={isLoading} 
      />
    </div>
  );
}