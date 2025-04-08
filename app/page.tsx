// app/page.tsx
'use client';

import { useEffect, useState } from "react";
import AverageScoreDisplay from "../components/AverageScoreDisplay";

export default function Home() {
  const [avgScore, setAvgScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAverageFCS = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Add a timestamp to prevent caching issues
        const response = await fetch(`/api/average-fcs?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch average FCS');
        }
        
        const data = await response.json();
        console.log('API Response:', data); // For debugging
        
        // Simplified data extraction
        if (data && typeof data.avg_score === 'number') {
          setAvgScore(data.avg_score);
        } else {
          console.warn('Unexpected response format:', data);
          setAvgScore(0);
        }
      } catch (err) {
        console.error('Error fetching average FCS:', err);
        setError('Failed to load average FCS data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAverageFCS();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
              Token FCS
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <AverageScoreDisplay 
              avgScore={avgScore} 
              isLoading={isLoading} 
            />
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 py-3 mt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 dark:text-gray-400">
          Powered by Quotient
        </div>
      </footer>
    </div>
  );
}