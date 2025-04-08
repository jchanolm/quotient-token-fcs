// components/ScoreDistributionDisplay.tsx
'use client';

interface ScoreDistributionProps {
  scoreDistribution: Record<string, number>;
  isLoading: boolean;
}

export default function ScoreDistributionDisplay({ scoreDistribution, isLoading }: ScoreDistributionProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded p-5 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
      </div>
    );
  }

  // Percentiles to display
  const percentiles = ['0.5', '0.75', '0.9', '0.95', '0.99'];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded p-5">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 text-center">
        Score Distribution (Percentiles)
      </h3>
      
      <div className="grid grid-cols-5 gap-4">
        {percentiles.map(percentile => (
          <div key={percentile} className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {parseInt(percentile) * 100}%
            </div>
            <div className="font-medium text-purple-600 dark:text-purple-400">
              {scoreDistribution?.[percentile] 
                ? Math.round(scoreDistribution[percentile]) 
                : 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}