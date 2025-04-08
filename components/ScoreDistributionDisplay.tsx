// components/ScoreDistributionDisplay.tsx
'use client';

interface ScoreDistributionProps {
  scoreDistribution: any;
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

  // Percentiles to display - match the API's percentiles
  const percentileLabels = ['50%', '75%', '90%', '95%', '99%'];
  
  // Ensure scoreDistribution is treated as an array (or convert empty to array)
  const scores = Array.isArray(scoreDistribution) ? scoreDistribution : [];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded p-5">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 text-center">
        Score Distribution (Percentiles)
      </h3>
      
      <div className="grid grid-cols-5 gap-4">
        {percentileLabels.map((label, index) => (
          <div key={label} className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {label}
            </div>
            <div className="font-medium text-purple-600 dark:text-purple-400">
              {scores[index] ? Math.round(scores[index]) : 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}