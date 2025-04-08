// components/AverageScoreDisplay.tsx
'use client';

interface AverageScoreProps {
  avgScore: number;
  isLoading: boolean;
}

export default function AverageScoreDisplay({ avgScore, isLoading }: AverageScoreProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded p-5 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded p-5">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center mb-2">
        Average FCS Score
      </h3>
      <div className="text-5xl font-light text-purple-600 dark:text-purple-400 text-center">
        {Math.round(avgScore)}
      </div>
    </div>
  );
}