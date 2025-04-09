// components/AverageScoreDisplay.tsx
'use client';

interface AverageScoreDisplayProps {
  avgScore: number;
  isLoading: boolean;
}

export default function AverageScoreDisplay({ avgScore, isLoading }: AverageScoreDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded p-6 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4 mx-auto"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded p-6 text-center">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
        Average FCS Score
      </h3>
      <div className="text-4xl font-light" style={{ color: 'rgba(147, 51, 234, 0.9)' }}>
        {avgScore ? avgScore.toFixed(2) : 'N/A'}
      </div>
    </div>
  );
}