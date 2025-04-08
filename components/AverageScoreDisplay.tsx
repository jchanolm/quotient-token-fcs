// components/FCSMetricsContainer.tsx
'use client';

import { useEffect, useState } from 'react';
import AverageScoreDisplay from './AverageScoreDisplay';
import ScoreDistributionDisplay from './ScoreDistributionDisplay';

interface FCSMetricsContainerProps {
  tokenAddress: string;
}

interface FCSMetricsData {
  avg_score: number;
  score_distribution: number[];
}

export default function FCSMetricsContainer({ tokenAddress }: FCSMetricsContainerProps) {
  const [metrics, setMetrics] = useState<FCSMetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use empty string for address to get the default from the API
        const queryParam = tokenAddress ? `?address=${tokenAddress}` : '';
        const response = await fetch(`/api/fcs-metrics${queryParam}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch FCS metrics');
        }
        
        const responseData = await response.json();
        
        // Handle the API response format - extract the actual data
        const metricsData = responseData.data || responseData;
        
        setMetrics(metricsData);
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
        scoreDistribution={metrics?.score_distribution || []} 
        isLoading={isLoading} 
      />
    </div>
  );
}