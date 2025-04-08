// components/FCSMetricsContainer.tsx
'use client';

import { useEffect, useState } from 'react';
import AverageScoreDisplay from './AverageScoreDisplay';
import ScoreDistributionDisplay from './ScoreDistributionDisplay';

interface FCSMetricsContainerProps {
  tokenAddress: string;
}

interface FCSMetrics {
  avg_score: number;
  score_distribution: Record<string, number>;
}

export default function FCSMetricsContainer({ tokenAddress }: FCSMetricsContainerProps) {
  const [metrics, setMetrics] = useState<FCSMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/fcs-metrics?address=${tokenAddress}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch FCS metrics');
        }
        
        const data = await response.json();
        setMetrics(data);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <AverageScoreDisplay 
        avgScore={metrics?.avg_score || 0} 
        isLoading={isLoading} 
      />
      
      <ScoreDistributionDisplay 
        scoreDistribution={metrics?.score_distribution || {}} 
        isLoading={isLoading} 
      />
    </div>
  );
}